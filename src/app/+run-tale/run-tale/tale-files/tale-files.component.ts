import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

import { FileElement } from '@files/models/file-element';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { CollectionService } from '@api/services/collection.service';
import { DatasetService } from '@api/services/dataset.service';
import { WorkspaceService } from '@api/services/workspace.service';
import { TokenService } from '@api/token.service';

import { Tale } from '@api/models/tale';

enum ParentType {
    Folder = "folder",
    Collection = "collection",
    User = "user"
}

@Component({
  selector: 'tale-files',
  templateUrl: './tale-files.component.html',
  styleUrls: ['./tale-files.component.scss']
})
export class TaleFilesComponent implements OnInit, OnChanges {
  @Input() tale: Tale;
  @Input() taleId: string;
  
  folders: FileElement[] = [];
  files: FileElement[] = [];
  currentFolder: FileElement;
  currentFolderId: string;

  fileElements: FileElement[] = [];
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  currentNav = 'external_data';

  dataNavRootId : string;
  wsNavRootId : string;

  constructor(
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private folderService: FolderService,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private datasetService: DatasetService,
    private workspaceService: WorkspaceService,
    private tokenService: TokenService,
  ) {

  }

  load() {
    if (this.currentFolderId) {
      // TODO: Load a particular folder's contents
      let itemParams = { folderId: this.currentFolderId };
      let folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };

      // FIXME: GET /folders/:id doesn't return full models for files/folders
      this.folders = [];
      this.folderService.folderFind(folderParams).subscribe(folders => {
        this.folders = folders;
        this.ref.detectChanges();
      });

      // FIXME: GET /folders/:id doesn't return full models for files/folders
      this.files = [];
      this.itemService.itemFind(itemParams).subscribe(items => {
        this.files = items;
        this.ref.detectChanges();
      });
      //this.setCurrentRoot(folderId);
      return;
    }
    switch (this.currentNav) {
      case 'external_data':
        // Display Tale datasets
        let dsParams = { myData: false };
        this.files = [];
        this.folders = [];
        let params = {};
        this.datasetService.datasetListDatasets(params).subscribe(datasets => {
          let matches: any[] = [];
          (datasets || []).forEach(ds => {
            if (this.tale.dataSet.find(mount => mount.itemId === ds._id)) {
              matches.push(ds);
            }
          });
          this.folders = matches;
          this.ref.detectChanges();
        });
        
        this.currentRoot = null;
        this.currentFolderId = null;
        this.canNavigateUp = false;
        break;
      case 'tale_workspace':
        // Load folder with same id as tale.workspaceId
        this.currentFolderId = this.tale.workspaceId;
        let itemParams = { folderId: this.currentFolderId };
        let folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };


        // FIXME: GET /folders/:id doesn't return full models for files/folders
        this.folders = [];
        this.folderService.folderFind(folderParams).subscribe(folders => {
          this.folders = folders;
          this.ref.detectChanges();
        });

        // FIXME: GET /folders/:id doesn't return full models for files/folders
        this.files = [];
        this.itemService.itemFind(itemParams).subscribe(items => {
          this.files = items;
          this.ref.detectChanges();
        });

        this.currentRoot = null;
        this.currentFolderId = null;
        this.canNavigateUp = false;
        break;
      default:
        console.error("Unrecognized nav encountered:", this.currentNav);
        break;
    }
  }

  detectQueryString() {
    this.route.queryParams.subscribe(params => {
      const fid = params['parentid'] || null;
      const type = params['parentType'] || 'folder';
      if (fid) {
        this.currentFolderId = fid;
        this.setCurrentRoot(fid, type);
      }

      const nav = params['nav'] || null;
      if (nav) {
        this.currentNav = nav;
      }

      this.load();
    });
  }

  switchNav(nav: string) {
    this.currentNav = nav;
    if (this.currentFolderId) {
      this.router.navigateByUrl('/run/' + this.taleId + '?tab=files&nav=' + nav + '&parentid=' + this.currentFolderId);
    } else {
      this.router.navigateByUrl('/run/' + this.taleId + '?tab=files&nav=' + nav);
    }
    //this.load(nav);
  }

  isNavActive(nav: string) {
    return this.currentNav === nav;
  }

  ngOnChanges() {
    this.detectQueryString();
  }

  setCurrentRoot(resourceId: string, modelType: string = 'folder') {
    if (resourceId) {
      switch (modelType) {
        case 'folder':
          this.folderService.folderGetFolder(resourceId).subscribe(folder => {
            this.currentRoot = folder;
            this.currentFolderId = this.currentRoot._id;
            this.canNavigateUp = this.currentRoot ? true : false;
            console.log(`currentRoot is now: ${this.currentRoot.name}`);
          });
          break;
        case 'collection':
          this.collectionService.collectionGetCollection(resourceId).subscribe(collection => {
            this.currentRoot = collection;
            this.currentFolderId = this.currentRoot._id;
            this.canNavigateUp = this.currentRoot ? true : false;
            console.log(`currentRoot is now: ${this.currentRoot.name}`);
          });
          break;
        default:
          console.error("Unrecognized model type encountered:", modelType);
          break;
      }
    } else {
      this.currentRoot = null;
      this.currentFolderId = null;
      this.canNavigateUp = false;
    }
  }

  getName(folder: FileElement) {
    return folder.name;
  }

  ngOnInit() {
    this.detectQueryString();
  }

  addFolder(folder: { name: string }) {
    const now = new Date();
    const e = new FileElement();
    e._modelType = "folder";
    e.created = e.updated = now;
    e.description = "";
    e.size = 0;
    e.parentId = this.currentRoot ? this.currentRoot._id : null;
    e.name = folder.name;
    //this.fileService.add(e);

    // TODO: POST /folder
    //this.load();
  }

  removeElement(element: FileElement) {
    // TODO: DELETE /item
    //this.fileService.delete(element._id);
    //this.load();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    // TODO: PUT /item/:id
    //this.fileService.update(event.element._id, { parentId: event.moveTo._id });
    //this.load();
  }

  renameElement(element: FileElement) {
    // TODO: PUT /item/:id
    //this.fileService.update(element._id, { name: element.name });
    //this.load();
  }

  navigateUp() {
    // If we find that our parent is a collection, that collection is the root
    if (this.currentRoot && this.currentRoot.parentCollection === ParentType.Collection) {
      this.currentRoot = null;
      this.currentFolderId = null;
      this.canNavigateUp = false;
      this.router.navigateByUrl('/run/' + this.taleId + '?tab=files&nav=' + this.currentNav);
    } else {
      // TODO: GET /folder/:_id
      this.currentFolderId = this.currentRoot.parentId;
      let parentType = this.currentRoot.parentCollection;
      this.router.navigateByUrl('/run/' + this.taleId + '?tab=files&nav=' + this.currentNav + '&parentid=' + this.currentFolderId  + '&parentType=' + parentType);
    }
    this.currentPath = this.popFromPath(this.currentPath);
    this.ref.detectChanges();
  }

  navigateToFolder(element: FileElement) {
    if (this.currentRoot && this.currentFolderId) {
      element.parentId = this.currentRoot._id;
    } else {
      element.parentId = null;
    }
    this.currentRoot = element;
    //this.setCurrentRoot(element._id);
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.currentFolderId = element._id;
    this.router.navigateByUrl('/run/' + this.taleId + '?tab=files&nav=' + this.currentNav + '&parentid=' + this.currentFolderId + '&parentType=' + element._modelType);
    this.canNavigateUp = true;
    this.ref.detectChanges();
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    // TODO: Reuse truncate pipe here?
    const fname = folderName.length > 20 ? folderName.substring(0, 20) + '...' : folderName;
    p += `${fname}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
