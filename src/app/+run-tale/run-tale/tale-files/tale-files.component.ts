import { ViewChild, Component, OnInit, Input, OnChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tale } from '@api/models/tale';
import { CollectionService } from '@api/services/collection.service';
import { DatasetService } from '@api/services/dataset.service';
import { FileService } from '@api/services/file.service';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { ResourceService } from '@api/services/resource.service';
import { WorkspaceService } from '@api/services/workspace.service';
import { TokenService } from '@api/token.service';
import { FileElement } from '@files/models/file-element';
import { TruncatePipe } from '@framework/core/truncate.pipe';
import { WindowService } from '@framework/core/window.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';

import { BehaviorSubject } from 'rxjs';

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
  
  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
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
      const url = URL.createObjectURL(upload);
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
          const files = self.files.value;
          files.push(initResp);
          self.files.next(files);

          // Create a URL to the file blob and start the upload
          const chunkParams = { uploadId: initResp._id, offset, chunk: contents };
          self.fileService.fileReadChunk(chunkParams).subscribe((chunkResp: any) => {
            console.log(`Uploading chunk ${offset} of ${params.name}:`, chunkResp);
            if (chunkResp.size === upload.size) {
              console.log("Upload complete: ", chunkResp.name);
            }
            const files = self.files.value;
            const existing = files.find(file => file._id === chunkResp._id);
            const index = files.indexOf(existing);
            files[index] = chunkResp;
            self.files.next(files);
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
      this.folderService.folderFind(folderParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });

      // FIXME: GET /folders/:id doesn't return full models for files/folders
      this.itemService.itemFind(itemParams)
                      .pipe(enterZone(this.zone))
                      .subscribe(items => {
                        this.files.next(items);
                      });

      return;
    }
    switch (this.currentNav) {
      case 'home':
        this.placeholderMessage = 'Your home folder is empty. Add a folder or file using the (+) button at the top-right.';
        const itemParams = { folderId: this.currentFolderId };
        const folderParams = { parentId: this.currentFolderId, parentType: ParentType.Folder };
        
        // Fetch folders in the home folder
        this.folderService.folderFind(folderParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });

        // Fetch items in the home folder
        this.itemService.itemFind(itemParams)
                        .pipe(enterZone(this.zone))
                        .subscribe(items => {
                          this.files.next(items);
                        });
        break;
      case 'external_data':
        // Set the placeholder to describe how to Register a Dataset with this Tale
        this.placeholderMessage = 'This Tale does not have any datasets registered. Register a dataset to see it listed here.';

        // Fetch registered datasets
        const params = { myData: false };
        this.datasetService.datasetListDatasets(params)
                           .pipe(enterZone(this.zone))
                           .subscribe((value: Array<FileElement>) => {
          const matches: Array<FileElement> = [];
          this.tale.dataSet.forEach(mount => {
            const match = value.find(ds => mount.itemId === ds._id);
            if (match) {
              matches.push(match);
            }
          });
          this.zone.run(() => {
            this.folders.next(matches);
            this.files.next([]);
          });
        });
        
        this.currentRoot = undefined;
        this.currentFolderId = undefined;
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
          this.folderService.folderFind(folderParams)
                            .subscribe(folders => {
                              this.zone.run(() => { this.folders.next(folders); });
                            });

          // Fetch items in the workspace
          //this.files = [];
          this.itemService.itemFind(itemParams)
                          .subscribe(items => {
                            this.zone.run(() => { this.files.next(items); });
                          });

          this.currentRoot = undefined;
          this.currentFolderId = undefined;
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
    this.route.queryParams.subscribe((params) => {
      const fid = params.parentid || undefined;
      const type = params.parentType || 'folder';
      if (fid) {
        this.currentFolderId = fid;
        this.setCurrentRoot(fid, type);
      }

      const nav = params.nav || undefined;
      if (nav && this.currentNav !== nav) {
        this.currentNav = nav;
      }

      this.load();
    });
  }

  switchNav(nav: string) {
    this.currentNav = nav;
    this.currentFolderId = undefined;
    this.currentRoot = undefined;
    this.currentPath = '';
    this.navigate();
  }

  isNavActive(nav: string) {
    return this.currentNav === nav;
  }

  truncatePathSegments(path: string) {
    let truncatedSegments: Array<string> = [];
    path.split('/').forEach((s: string) => {
      truncatedSegments.push(this.truncate.transform(s, 30));
    });

    return truncatedSegments.join('/');
  }

  setCurrentPath() {
    // Then set the current path
    const params = { id: this.currentRoot._id, type: this.currentRoot._modelType };
    this.resourceService.resourcePath(params)
                        .pipe(enterZone(this.zone))
                        .subscribe((resp: string) => {
      if (this.currentNav === 'external_data') {
        if (resp.indexOf(DATA_ROOT_PATH) !== -1) {
          const pathSuffix = resp.split(DATA_ROOT_PATH)[1];
          this.currentPath = this.truncatePathSegments(pathSuffix);
        } else {
          console.error("Error: malformed resource path encountered... aborting:", resp);
        }
      } else if (this.currentNav === 'tale_workspace') {
        if (resp.indexOf(this.taleId) !== -1) {
          const pathSuffix = resp.split(this.taleId)[1];
          this.currentPath = this.truncatePathSegments(pathSuffix);
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
          });
          break;
        default:
          console.error("Unrecognized model type encountered:", modelType);
          break;
      }
    } else {
      this.currentRoot = undefined;
      this.currentFolderId = undefined;
      this.canNavigateUp = false;
      this.currentPath = '';
    }
  }

  getName(folder: FileElement) {
    return folder.name;
  }

  addFolder(folder: { name: string }) {
    const now = new Date();
    let parentId = undefined;

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
      const folders = this.folders.value;
      folders.push(newFolder);
      this.folders.next(folders);
    });
  }

  removeElement(element: FileElement) {
    if (element._modelType === 'folder') {
      // Element is a folder, delete it 
      this.folderService.folderDeleteFolder({ id: element._id })
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        console.log("Folder deleted successfully:", resp);
        const folders = this.folders.value;
        const index = folders.indexOf(element);
        folders.splice(index, 1);
        this.folders.next(folders);
      });
    } else if (element._modelType === 'item') {
      // Element is an item, delete it
      this.itemService.itemDeleteItem(element._id)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item deleted successfully:", resp);
        const files = this.files.value;
        const index = files.indexOf(element);
        files.splice(index, 1);
        this.files.next(files);
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
      });
    } else if (src._modelType === 'item') {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item moved successfully:", resp);
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
        const folders =  this.folders.value;
        const index = folders.indexOf(element);
        folders[index] = resp;
        this.folders.next(folders);
      });
    } else if (element._modelType === 'item') {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item renamed successfully:", resp);
        const files = this.files.value;
        const index = files.indexOf(element);
        files[index] = resp;
        this.files.next(files);
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
        const folders = this.folders.value;
        folders.push(resp);
        this.folders.next(folders);
      });
    } else if (element._modelType === 'item') {
      this.itemService.itemCopyItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        console.log("Item copied successfully:", resp);
        const files = this.files.value;
        files.push(resp);
        this.files.next(files);
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
          parentid: undefined
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
      this.currentRoot = undefined;
      this.currentFolderId = undefined;
      this.canNavigateUp = false;
      this.currentPath = '';
    } else {
      this.currentFolderId = this.currentRoot ? this.currentRoot.parentId : undefined;
    }
    this.navigate();
  }

  navigateToFolder(element: FileElement) {
    if (this.currentRoot && this.currentFolderId) {
      element.parentId = this.currentRoot._id;
    } else {
      element.parentId = undefined;
    }
    this.setCurrentRoot(element._id);
    this.currentFolderId = element._id;
    this.navigate();
  }
}
