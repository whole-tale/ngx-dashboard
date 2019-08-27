import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

import { FileElement } from '@files/models/file-element';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { CollectionService } from '@api/services/collection.service';
import { DatasetService } from '@api/services/dataset.service';
import { WorkspaceService } from '@api/services/workspace.service';
import { ResourceService } from '@api/services/resource.service';
import { TokenService } from '@api/token.service';

import { Tale } from '@api/models/tale';

// TODO: Is there a better place to store these constants?
const DATA_ROOT_PATH = '/collection/WholeTale Catalog/WholeTale Catalog';
const WORKSPACES_ROOT_PATH = '/collection/WholeTale Workspaces/WholeTale Workspaces';

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

  @Input() allowDataRoot = false;
  @Input() allowWorkspaceRoot = false;

  dataRoot: FileElement;
  wsRoot: FileElement;
  
  folders: FileElement[] = [];
  files: FileElement[] = [];
  currentFolder: FileElement;
  currentFolderId: string;

  placeholderMessage: string;
  fileElements: FileElement[] = [];
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  currentNav = 'external_data';

  dataNavRootId : string;
  wsNavRootId : string;

  constructor(
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private folderService: FolderService,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private datasetService: DatasetService,
    private workspaceService: WorkspaceService,
    private tokenService: TokenService,
    private resourceService: ResourceService,
  ) {
    // Fetch Data root
    const dataRootParams = { test: false, path: DATA_ROOT_PATH };
    this.resourceService.resourceLookup(dataRootParams).subscribe(resource => {
      this.dataRoot = resource;
    });

    // Fetch Workspace root
    const wsRootParams = { test: false, path: WORKSPACES_ROOT_PATH };
    this.resourceService.resourceLookup(wsRootParams).subscribe(resource => {
      this.wsRoot = resource;
    });
  }

  load() {
    if (this.currentFolderId) {
      if (this.currentNav === 'external_data') {
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This folder is empty, but Datasets are immutable and no folders/files can be added.';
      } else {
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This folder is empty. Add some folders or files using the (+) icon at the top-right.';
      }

      // TODO: Load a particular folder's contents
      const itemParams = { folderId: this.currentFolderId };
      const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };

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
        // Set the placeholder to describe how to Register a Dataset with this Tale
        this.placeholderMessage = 'This Tale does not have any datasets registered. Register a dataset to see it listed here.';

        // Fetch registered datasets
        this.files = [];
        this.folders = [];
        const params = { myData: false };
        this.datasetService.datasetListDatasets(params).subscribe((datasets: FileElement[]) => {
          const matches: FileElement[] = [];
          this.tale.dataSet.forEach(mount => {
            let match = datasets.find(ds => mount.itemId === ds._id);
            if (match) {
              matches.push(match);
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
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This Tale does not have any datasets registered. Register a dataset to see it listed here.';

        // Load folder with same id as tale.workspaceId
        this.currentFolderId = this.tale.workspaceId;
        const itemParams = { folderId: this.currentFolderId };
        const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };

        // Fetch folders in the workspace
        this.folders = [];
        this.folderService.folderFind(folderParams).subscribe(folders => {
          this.folders = folders;
          this.ref.detectChanges();
        });

        // Fetch items in the workspace
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
    this.currentFolderId = null;
    this.currentRoot = null;
    this.router.navigate(['run', this.taleId ], { 
      queryParamsHandling: null, 
      queryParams: { 
        tab: 'files',
        nav: nav
      }
    });
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
    // TODO: Allow user to navigate to root folders?
    // NOTE: we may need something like this for the Data Catalog, but doesn't need to be this same component

    // If we find that our parentId matches our known root folders, then we have reached the root
    if (this.currentRoot && (this.currentRoot.parentId === this.dataRoot._id || this.currentRoot.parentId === this.tale.workspaceId)) {
      this.currentRoot = null;
      this.currentFolderId = null;
      this.canNavigateUp = false;
      this.router.navigate(['run', this.taleId ], { 
        queryParamsHandling: null, 
        queryParams: {
          tab: 'files',
          nav: this.currentNav
        }
      });
    } else {
      this.currentFolderId = this.currentRoot.parentId;
      this.router.navigate(['run', this.taleId ], { 
        queryParamsHandling: "merge", 
        queryParams: { 
          tab: 'files',
          nav: this.currentNav, 
          parentid: this.currentFolderId 
        }
      });
    }
    this.currentPath = this.popFromPath(this.currentPath);
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
    this.router.navigate(['run', this.taleId ], { 
      queryParamsHandling: "merge", 
      queryParams: { 
        tab: 'files',
        nav: this.currentNav, 
        parentid: this.currentFolderId 
      }
    });
    this.canNavigateUp = true;
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
