import { ViewChild, Component, OnInit, Input, OnChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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
import { WindowService } from '@framework/core/window.service';

import { Tale } from '@api/models/tale';

import { TruncatePipe } from '@framework/core/truncate.pipe';

const URL = window['webkitURL'] || window.URL;

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

enum ContentDisposition {
    Attachment = "attachment",
    Inline = "inline"
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

  dataRoot: FileElement;
  wsRoot: FileElement;
  
  folders: BehaviorSubject<FileElement[]> = new BehaviorSubject<FileElement[]>([]);
  files: BehaviorSubject<FileElement[]> = new BehaviorSubject<FileElement[]>([]);
  currentFolderId: string;

  placeholderMessage: string;
  currentRoot: FileElement;
  currentPath: string = '';
  canNavigateUp = false;

  currentNav = 'external_data';

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
    private window: WindowService,
    private truncate: TruncatePipe,
  ) {
    // Fetch Data root
    const dataRootParams = { test: false, path: DATA_ROOT_PATH };
    this.resourceService.resourceLookup(dataRootParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(resource => {
      this.dataRoot = resource;
    });

    // Fetch Workspace root
    const wsRootParams = { test: false, path: WORKSPACES_ROOT_PATH };
    this.resourceService.resourceLookup(wsRootParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(resource => {
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

    const self = this;
    this.uploadQueue.forEach(upload => {
      let url = URL.createObjectURL(upload);
      fetch(url).then(resp => resp.arrayBuffer()).then(contents => {
        const params = {
          parentType: UploadType.Folder, 
          parentId: self.currentFolderId ? self.currentFolderId : self.tale.workspaceId,
          name: upload.name,
          size: upload.size,
          chunk: contents
        };

        console.log(`Starting upload for ${params.name}...`);
        self.fileService.fileInitUpload(params).subscribe((initResp: any) => {
          console.log(`Uploading chunks for ${params.name}:`, initResp);
          const offset = 0;
          let files = self.files.value;
          files.push(initResp);
          self.files.next(files);
          //self.ref.detectChanges();

          // Create a URL to the file blob and start the upload
          const chunkParams = { uploadId: initResp._id, offset, chunk: contents };
          self.fileService.fileReadChunk(chunkParams).subscribe((chunkResp: any) => {
            console.log(`Uploading chunk ${offset} of ${params.name}:`, chunkResp);
            if (chunkResp.size === upload.size) {
              console.log("Upload complete: ", chunkResp.name);
            }
            let files = self.files.value;
            let existing = files.find(file => file._id === chunkResp._id);
            let index = files.indexOf(existing);
            files[index] = chunkResp;
            self.files.next(files);
            //self.ref.detectChanges();
          });
        });
      });
    });
  }

  load() {
    const self = this;
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
      //this.folders = [];
      this.folderService.folderFind(folderParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                          //this.ref.detectChanges();
                        });

      // FIXME: GET /folders/:id doesn't return full models for files/folders
      //this.files = [];
      this.itemService.itemFind(itemParams)
                      .pipe(enterZone(this.zone))
                      .subscribe(items => {
                        this.files.next(items);
                        //this.ref.detectChanges();
                      });

      //this.setCurrentRoot(folderId);
      return;
    }
    switch (this.currentNav) {
      case 'home':
        this.placeholderMessage = 'Your home folder is empty. Add a folder or file using the (+) button at the top-right.';
        const itemParams = { folderId: this.currentFolderId };
        const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };
        
        // Fetch folders in the home folder
        //this.folders = [];
        this.folderService.folderFind(folderParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                          //this.ref.detectChanges();
                        });

        // Fetch items in the home folder
        //this.files = [];
        this.itemService.itemFind(itemParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(items => {
                          this.files.next(items);
                          //this.ref.detectChanges();
                        });
        break;
      case 'external_data':
        // Set the placeholder to describe how to Register a Dataset with this Tale
        this.placeholderMessage = 'This Tale does not have any datasets registered. Register a dataset to see it listed here.';

        // Fetch registered datasets
        //this.files = [];
        //this.folders = [];
        const params = { myData: false };
        this.datasetService.datasetListDatasets(params)
                           .pipe(enterZone(this.zone))
                           .subscribe((value: FileElement[]) => {
          const matches: FileElement[] = [];
          this.tale.dataSet.forEach(mount => {
            const match = value.find(ds => mount.itemId === ds._id);
            if (match) {
              matches.push(match);
            }
          });
          this.zone.run(() => {
            self.folders.next(matches);
            self.files.next([]);
          });
          //this.ref.detectChanges();
        });
        
        this.currentRoot = null;
        this.currentFolderId = null;
        this.canNavigateUp = false;
        this.currentPath = '';
        break;
      case 'tale_workspace':
        // Set the placeholder to describe how to Create Folder or Upload File
        this.placeholderMessage = 'This Tale\'s workspace is empty. Add a folder or file using the (+) button at the top-right.';

        // Short-circuit for if we haven't loaded the tale yet
        // FIXME: Can we avoid this race condition in a more elegant way?
        if (this.tale.workspaceId) {
          // Load folder with id=tale.workspaceId
          this.currentFolderId = this.tale.workspaceId;
          const itemParams = { folderId: this.currentFolderId };
          const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };

          // Fetch folders in the workspace
          //this.folders = [];
          this.folderService.folderFind(folderParams)
                            //.pipe(enterZone(this.zone))
                            .subscribe(folders => {
                              this.zone.run(() => { self.folders.next(folders); });
                              //this.ref.detectChanges();
                            });

          // Fetch items in the workspace
          //this.files = [];
          this.itemService.itemFind(itemParams)
                          //.pipe(enterZone(this.zone))
                          .subscribe(items => {
                            this.zone.run(() => { this.files.next(items); });
                            //this.ref.detectChanges();
                          });

          this.currentRoot = null;
          this.currentFolderId = null;
          this.canNavigateUp = false;
          this.currentPath = '';
        }
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
      if (nav && this.currentNav !== nav) {
        this.currentNav = nav;
      }

      this.load();
    });
  }

  switchNav(nav: string) {
    this.currentNav = nav;
    this.currentFolderId = null;
    this.currentRoot = null;
    this.currentPath = '';
    this.navigate();
    //this.load(nav);
  }

  isNavActive(nav: string) {
    return this.currentNav === nav;
  }

  truncatePathSegments(path: string) {
    let truncatedSegments: string[] = [];
    path.split('/').forEach((s: string) => {
      truncatedSegments.push(this.truncate.transform(s, 30));
    });
    return truncatedSegments.join('/');
  }

  setCurrentPath() {
    // Then set the current path
    let params = { id: this.currentRoot._id, type: this.currentRoot._modelType };
    this.resourceService.resourcePath(params)
                        .pipe(enterZone(this.zone))
                        .subscribe((resp: string) => {
      if (this.currentNav === 'external_data') {
        if (resp.indexOf(DATA_ROOT_PATH) !== -1) {
          let pathSuffix = resp.split(DATA_ROOT_PATH)[1];
          this.currentPath = this.truncatePathSegments(pathSuffix);
          //this.ref.detectChanges();
        } else {
          console.error("Error: malformed resource path encountered... aborting:", resp);
        }
      } else if (this.currentNav === 'tale_workspace') {
        if (resp.indexOf(this.taleId) !== -1) {
          let pathSuffix = resp.split(this.taleId)[1];
          this.currentPath = this.truncatePathSegments(pathSuffix);
          //this.ref.detectChanges();
        } else {
          console.error("Error: malformed resource path encountered... aborting:", resp);
        }
      }
    });
  }

  setCurrentRoot(resourceId: string, modelType: string = 'folder') {
    // Lookup and set our root node
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
            this.setCurrentPath();
            //this.ref.detectChanges();
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
            this.setCurrentPath();
            //this.ref.detectChanges();
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
      this.currentPath = '';
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

    this.folderService.folderCreateFolder(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(newFolder => {
      let folders = this.folders.value;
      folders.push(newFolder);
      this.folders.next(folders);
      //this.ref.detectChanges();
    });
  }

  removeElement(element: FileElement) {
    if (element._modelType === 'folder') {
      // Element is a folder, delete it 
      this.folderService.folderDeleteFolder({ id: element._id })
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        console.log("Folder deleted successfully:", resp);
        let folders = this.folders.value;
        const index = folders.indexOf(element);
        folders.splice(index, 1);
        this.folders.next(folders);
        //this.ref.detectChanges();
      });
    } else if (element._modelType === 'item') {
      // Element is an item, delete it
      this.itemService.itemDeleteItem(element._id)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item deleted successfully:", resp);
        let files = this.files.value;
        const index = files.indexOf(element);
        files.splice(index, 1);
        this.files.next(files);
        //this.ref.detectChanges();
      });
    }
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    const src = event.element;
    const dest = event.moveTo;
    const params = { id: src._id, parentId: dest._id };
    if (src._modelType === 'folder') {
      // Element is a folder, move it 
      this.folderService.folderUpdateFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        console.log("Folder moved successfully:", resp);
        //this.ref.detectChanges();
      });
    } else if (src._modelType === 'item') {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item moved successfully:", resp);
        //this.ref.detectChanges();
      });
    }
  }

  renameElement(element: FileElement) {
    const params = { id: element._id, name: element.name };
    if (element._modelType === 'folder') {
      // Element is a folder, move it 
      this.folderService.folderUpdateFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        console.log("Folder renamed successfully:", resp);
        let folders =  this.folders.value;
        const index = folders.indexOf(element);
        folders[index] = resp;
        this.folders.next(folders);
        //this.ref.detectChanges();
      });
    } else if (element._modelType === 'item') {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item renamed successfully:", resp);
        let files = this.files.value;
        const index = files.indexOf(element);
        files[index] = resp;
        this.files.next(files);
        //this.ref.detectChanges();
      });
    }
  }

  copyElement(element: FileElement) {
    const params = { id: element._id };
    if (element._modelType === 'folder') {
      this.folderService.folderCopyFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        console.log("Folder copied successfully:", resp);
        let folders = this.folders.value;
        folders.push(resp);
        this.folders.next(folders);
        //this.ref.detectChanges();
      });
    } else if (element._modelType === 'item') {
      this.itemService.itemCopyItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item copied successfully:", resp);
        let files = this.files.value;
        files.push(resp);
        this.files.next(files);
        //this.ref.detectChanges();
      });
    }
  }

  downloadElement(element: FileElement) {
    if (element._modelType === 'folder') {
      const url = `${this.folderService.rootUrl}/${FolderService.folderDownloadFolderPath.replace('{id}', element._id)}?contentDisposition=attachment`;
      window.open(url, "_blank");
    } else if (element._modelType === 'item') {
      const url = `${this.itemService.rootUrl}/${ItemService.itemDownloadPath.replace('{id}', element._id)}?contentDisposition=attachment`;
      window.open(url, "_blank");
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
        queryParamsHandling: "merge", 
        queryParams: {
          tab: 'files',
          nav: this.currentNav,
          parentid: null
        }
      });
      this.canNavigateUp = false;
    }
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
      this.currentPath = '';
    } else {
      this.currentFolderId = this.currentRoot ? this.currentRoot.parentId : null;
    }
    //this.currentPath = this.popFromPath(this.currentPath);
    this.navigate();
  }

  navigateToFolder(element: FileElement) {
    if (this.currentRoot && this.currentFolderId) {
      element.parentId = this.currentRoot._id;
    } else {
      element.parentId = null;
    }
    this.setCurrentRoot(element._id);
    //this.currentPath = this.pushToPath(this.currentPath, element.name);
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
