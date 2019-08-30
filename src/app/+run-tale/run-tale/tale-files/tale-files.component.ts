import { ViewChild, Component, OnInit, Input, OnChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { switchMap, filter } from 'rxjs/operators';
import { enterZone } from '@framework/ngrx/enter-zone.operator';

import { FileElement } from '@files/models/file-element';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { FileService } from '@api/services/file.service';
import { CollectionService } from '@api/services/collection.service';
import { DatasetService } from '@api/services/dataset.service';
import { WorkspaceService } from '@api/services/workspace.service';
import { ResourceService } from '@api/services/resource.service';
import { TokenService } from '@api/token.service';

import { Tale } from '@api/models/tale';

// TODO: Is there a better place to store these constants?
const DATA_ROOT_PATH = '/collection/WholeTale Catalog/WholeTale Catalog';
const WORKSPACES_ROOT_PATH = '/collection/WholeTale Workspaces/WholeTale Workspaces';

enum UploadType {
    Folder = "folder",
    Item = "item"
}

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
  public uploadQueue: Set<File> = new Set();

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
  currentPath: string = '';
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
    private fileService: FileService,
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

  ngOnInit(): void {
    this.detectQueryString();
  }

  ngOnChanges(): void {
    this.detectQueryString();
  }

  uploadFiles(files: { [key: string]: File }) {
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.uploadQueue.add(files[key]);
      }
    }
    console.log(`${files.length} files added... upload queue contents:`, this.uploadQueue);

    this.uploadQueue.forEach(upload => {
      const params = {
        parentType: UploadType.Folder, 
        parentId: this.currentFolderId ? this.currentFolderId : this.tale.workspaceId,
        name: upload.name,
        size: upload.size
      };
      console.log(`Starting upload for ${params.name}...`);
      this.fileService.fileInitUpload(params).subscribe((initResp: any) => {
        console.log(`Uploading chunks for ${params.name}:`, initResp);
        const offset = 0;
        const self = this;
        this.files.push(initResp);
        this.ref.detectChanges();

        // Create a URL to the file blob and start the upload
        let url = window.URL.createObjectURL(upload);
        fetch(url).then(resp => resp.json()).then(contents => {
          const chunkMaxSize = 1024 * 1024 * 1;   // 1 MB
            const chunkParams = { uploadId: initResp._id, offset, chunk: contents };
            self.fileService.fileReadChunk(chunkParams).subscribe((chunkResp: any) => {
              console.log(`Uploading chunk ${offset} of ${params.name}:`, chunkResp);
              if (chunkResp.size === upload.size) {
                console.log("Upload complete: ", chunkResp.name);
              }
              let existing = self.files.find(file => file._id === chunkResp._id);
              let index = self.files.indexOf(existing);
              self.files[index] = chunkResp;
              self.ref.detectChanges();
            });
        });
      });
    });
  }

  load() {
    if (this.currentFolderId) {
      if (this.currentNav === 'external_data') {
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This folder is empty, but Datasets are immutable and no folders/files can be added.';
      } else {
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This folder is empty. Add a folder or file using the (+) button at the top-right.';
      }

      // TODO: Load a particular folder's contents
      const itemParams = { folderId: this.currentFolderId };
      const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };

      // FIXME: GET /folders/:id doesn't return full models for files/folders
      this.folders = [];
      this.folderService.folderFind(folderParams)
                        //.pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders = folders;
                          this.ref.detectChanges();
                        });

      // FIXME: GET /folders/:id doesn't return full models for files/folders
      this.files = [];
      this.itemService.itemFind(itemParams)
                      //.pipe(enterZone(this.zone))
                      .subscribe(items => {
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
        this.datasetService.datasetListDatasets(params)
                           //.pipe(enterZone(this.zone))
                           .subscribe((value: FileElement[]) => {
          const matches: FileElement[] = [];
          this.tale.dataSet.forEach(mount => {
            const match = value.find(ds => mount.itemId === ds._id);
            if (match) {
              matches.push(match);
            }
          });
          this.folders = matches;
          this.files = [];
          this.ref.detectChanges();
        });
        
        this.currentRoot = null;
        this.currentFolderId = null;
        this.canNavigateUp = false;
        break;
      case 'tale_workspace':
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This Tale\'s workspace is empty. Add a folder or file using the (+) button at the top-right.';

        // Load folder with same id as tale.workspaceId
        this.currentFolderId = this.tale.workspaceId;
        const itemParams = { folderId: this.currentFolderId };
        const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };

        // Fetch folders in the workspace
        this.folders = [];
        this.folderService.folderFind(folderParams)
                          //.pipe(enterZone(this.zone))
                          .subscribe(folders => {
                            this.folders = folders;
                            this.ref.detectChanges();
                          });

        // Fetch items in the workspace
        this.files = [];
        this.itemService.itemFind(itemParams)
                        //.pipe(enterZone(this.zone))
                        .subscribe(items => {
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
      if (fid && this.currentFolderId !== fid) {
        this.currentFolderId = fid;
        this.setCurrentRoot(fid, type);
      }

      const nav = params['nav'] || null;
      if (nav && this.currentNav !== nav) {
        this.currentNav = nav;
      }

      this.load();
    });
  }

  switchNav(nav: string) {
    this.zone.run(() => {
      this.currentNav = nav;
      this.currentFolderId = null;
      this.currentRoot = null;
      this.currentPath = '';
      this.navigate();
    });
    //this.load(nav);
  }

  isNavActive(nav: string) {
    return this.currentNav === nav;
  }

  setCurrentRoot(resourceId: string, modelType: string = 'folder') {
    if (resourceId) {
      switch (modelType) {
        case 'folder':
          this.folderService.folderGetFolder(resourceId)
                            .pipe(enterZone(this.zone))
                            .subscribe(folder => {
            this.currentRoot = folder;
            this.currentFolderId = this.currentRoot._id;
            this.canNavigateUp = this.currentRoot ? true : false;
            console.log(`currentRoot is now: ${this.currentRoot.name}`);
            this.ref.detectChanges();
          });
          break;
        case 'collection':
          this.collectionService.collectionGetCollection(resourceId)
                                .pipe(enterZone(this.zone))
                                .subscribe(collection => {
            this.currentRoot = collection;
            this.currentFolderId = this.currentRoot._id;
            this.canNavigateUp = this.currentRoot ? true : false;
            console.log(`currentRoot is now: ${this.currentRoot.name}`);
            this.ref.detectChanges();
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

  addFolder(folder: { name: string }) {
    const now = new Date();
    let parentId = null;

    // Datasets are immutable - prevent modifying them directly
    if (this.currentNav !== 'external_data') {
      // If we have a folderId, use that.. otherwise we can assume the root based on currentNav
      parentId = this.currentRoot ? this.currentFolderId : this.tale.workspaceId;
    }

    let params = {
      parentType: ParentType.Folder,
      parentId: parentId,
      name: folder.name,
      description: ""
    };

    this.folderService.folderCreateFolder(params).subscribe(newFolder => {
      this.folders.push(newFolder);
      this.ref.detectChanges();
    });
  }

  removeElement(element: FileElement) {
    if (this.folders.indexOf(element) !== -1) {
      // Element is a folder, delete it 
      let params = { id: element._id };
      this.folderService.folderDeleteFolder(params).subscribe(resp => {
        console.log("Folder deleted successfully:", resp);
        const index = this.folders.indexOf(element);
        this.folders.splice(index, 1);
        this.ref.detectChanges();
      });
    } else if (this.files.indexOf(element) !== -1) {
      // Element is an item, delete it
      this.itemService.itemDeleteItem(element._id).subscribe(resp => {
        console.log("Item deleted successfully:", resp);
        const index = this.files.indexOf(element);
        this.files.splice(index, 1);
        this.ref.detectChanges();
      });
    }
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    const src = event.element;
    const dest = event.moveTo;
    const params = { id: src._id, parentId: dest._id };
    if (this.folders.indexOf(src) !== -1) {
      // Element is a folder, move it 
      this.folderService.folderUpdateFolder(params).subscribe(resp => {
        console.log("Folder moved successfully:", resp);
        this.ref.detectChanges();
      });
    } else if (this.files.indexOf(src) !== -1) {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params).subscribe(resp => {
        console.log("Item moved successfully:", resp);
        this.ref.detectChanges();
      });
    }
  }

  renameElement(element: FileElement) {
    const params = { id: element._id, name: element.name };
    if (this.folders.indexOf(element) !== -1) {
      // Element is a folder, move it 
      this.folderService.folderUpdateFolder(params).subscribe(resp => {
        console.log("Folder renamed successfully:", resp);
        const index = this.folders.indexOf(element);
        this.folders[index] = resp;
        this.ref.detectChanges();
      });
    } else if (this.files.indexOf(element) !== -1) {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params).subscribe(resp => {
        console.log("Item renamed successfully:", resp);
        const index = this.files.indexOf(element);
        this.files[index] = resp;
        this.ref.detectChanges();
      });
    }
  }

  copyElement(element: FileElement) {
    const params = { id: element._id };
    if (this.folders.indexOf(element) !== -1) {
      this.folderService.folderCopyFolder(params).subscribe(resp => {
        console.log("Folder copied successfully:", resp);
        this.folders.push(resp);
        this.ref.detectChanges();
      });
    } else {
      this.itemService.itemCopyItem(params).subscribe(resp => {
        console.log("Item copied successfully:", resp);
        this.files.push(resp);
        this.ref.detectChanges();
      });
    }
  }

  downloadElement(element: FileElement) {
    const params = { id: element._id };
    if (this.folders.indexOf(element) !== -1) {
      this.folderService.folderDownloadFolder(params).subscribe(resp => {
        console.log("Folder downloaded successfully:", resp);
      });
    } else {
      this.itemService.itemDownload(params).subscribe(resp => {
        console.log("Item downloaded successfully:", resp);
      });
    }
  }

  navigate() {
    if (this.currentFolderId) {
      this.router.navigate(['run', this.taleId ], { 
        queryParamsHandling: "merge", 
        queryParams: { 
          tab: 'files',
          nav: this.currentNav, 
          parentid: this.currentFolderId 
        }
      });
      this.canNavigateUp = true;
    } else {
      this.router.navigate(['run', this.taleId ], { 
        queryParamsHandling: null, 
        queryParams: {
          tab: 'files',
          nav: this.currentNav
        }
      });
      this.canNavigateUp = false;
    }
  }

  navigateUpToFolder(folderName: string) {

  }

  // TODO: Parameterize to make path clickable?
  navigateUp() {
    // TODO: Allow user to navigate to root folders?
    // NOTE: we may need something like this for the Data Catalog, but doesn't need to be this same component

    // If we find that our parentId matches our known root folders, then we have reached the root
    if (this.currentRoot && (this.currentRoot.parentId === this.dataRoot._id || this.currentRoot.parentId === this.tale.workspaceId)) {
      this.currentRoot = null;
      this.currentFolderId = null;
      this.canNavigateUp = false;
    } else {
      this.currentFolderId = this.currentRoot ? this.currentRoot.parentId : null;
    }
    this.currentPath = this.popFromPath(this.currentPath);
    this.navigate();
  }

  navigateToFolder(element: FileElement) {
    if (this.currentRoot && this.currentFolderId) {
      element.parentId = this.currentRoot._id;
    } else {
      element.parentId = null;
    }
    //this.currentRoot = element;
    //this.setCurrentRoot(element._id);
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.currentFolderId = element._id;
    this.navigate();
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
