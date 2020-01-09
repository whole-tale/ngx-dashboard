import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Dataset } from '@api/models/dataset';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { CollectionService } from '@api/services/collection.service';
import { DatasetService } from '@api/services/dataset.service';
import { FileService } from '@api/services/file.service';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { ResourceService } from '@api/services/resource.service';
import { TaleService } from '@api/services/tale.service';
import { UserService } from '@api/services/user.service';
import { WorkspaceService } from '@api/services/workspace.service';
import { FileElement } from '@files/models/file-element';
import { LogService } from '@framework/core/log.service';
import { TruncatePipe } from '@framework/core/truncate.pipe';
import { WindowService } from '@framework/core/window.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { RegisterDataDialogComponent } from '../modals/register-data-dialog/register-data-dialog.component';
import { SelectDataDialogComponent } from '../modals/select-data-dialog/select-data-dialog.component';
import { TaleWorkspacesDialogComponent } from '../modals/tale-workspaces-dialog/tale-workspaces-dialog.component';

const URL = window['webkitURL'] || window.URL;  // tslint:disable-line

// TODO: Is there a better place to store these constants?
const HOME_ROOT_NAME = 'Home';
const DATA_ROOT_PATH = '/collection/WholeTale Catalog/WholeTale Catalog';
const WORKSPACES_ROOT_PATH = '/collection/WholeTale Workspaces/WholeTale Workspaces';

// TODO: Abstract/move enums to reuseable helper
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

interface Selectable {
  _modelType: string;
  _id: string;
}

@Component({
  selector: 'app-tale-files',
  templateUrl: './tale-files.component.html',
  styleUrls: ['./tale-files.component.scss']
})
export class TaleFilesComponent implements OnInit, OnChanges {
  uploadQueue: Set<File> = new Set();

  @Input() tale: Tale;
  @Input() taleId: string;

  @Output() readonly taleUpdated = new EventEmitter<Tale>();

  homeRoot: FileElement;
  dataRoot: FileElement;
  wsRoot: FileElement;
  
  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  currentFolderId: string;

  currentRoot: FileElement;
  currentPath = '';
  canNavigateUp = false;

  currentNav = 'external_data';

  constructor(
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LogService,
    private folderService: FolderService,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private datasetService: DatasetService,
    private workspaceService: WorkspaceService,
    private fileService: FileService,
    private userService: UserService,
    private taleService: TaleService,
    private resourceService: ResourceService,
    private window: WindowService,
    private truncate: TruncatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.detectQueryString();

    // Fetch Home root
    this.userService.userGetMe().subscribe((user : User) => {
      const homeRootParams = { parentId: user._id, parentType: ParentType.User, text: HOME_ROOT_NAME };
      const dataRootParams = { test: false, path: DATA_ROOT_PATH };
      const wsRootParams = { test: false, path: WORKSPACES_ROOT_PATH };

      const homeFind = this.folderService.folderFind(homeRootParams);
      const dataFind = this.resourceService.resourceLookup(dataRootParams);
      const wsFind = this.resourceService.resourceLookup(wsRootParams);
      
      // Fetch all root folders before loading
      forkJoin(homeFind, dataFind, wsFind).pipe(enterZone(this.zone)).subscribe((value: Array<any>) => {
        if (value.length < 2) {
          this.logger.error("Error: Value mismatch when fetching root folders");
        }

        const homeFolderResults = value[0];

        if (homeFolderResults && homeFolderResults.length) {
          this.homeRoot = homeFolderResults[0];
        }

        this.dataRoot = value[1];
        this.wsRoot = value[2];

        this.load();
      });
    });
  }

  ngOnChanges(): void {
    this.detectQueryString();
  }

  detectQueryString(): void {
    this.route.queryParams.subscribe(params => {
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

  uploadFiles(filesToUpload: { [key: string]: File }): void {
    for (const key in filesToUpload) {
      if (!isNaN(parseInt(key, 10))) {
        this.uploadQueue.add(filesToUpload[key]);
      }
    }
    this.logger.debug(`${filesToUpload.length} files added... upload queue contents:`, this.uploadQueue);

    this.uploadQueue.forEach(upload => {
      const url = URL.createObjectURL(upload);

      // Upload to the current folder, if possible
      const parentId = this.currentFolderId ? this.currentFolderId : 
        // Otherwise upload to "workspace" if we're on the Workspaces nav and have no currentFolderId, else upload to "Home" folder
        this.currentNav === 'tale_workspaces' ? this.tale.workspaceId : this.homeRoot._id; 
      fetch(url).then(resp => resp.arrayBuffer()).then(contents => {
        const params = { 
          parentId,
          parentType: UploadType.Folder,
          name: upload.name,
          size: upload.size,
          chunk: contents
        };

        this.logger.debug(`Starting upload for ${params.name}...`);
        this.fileService.fileInitUpload(params).subscribe((initResp: any) => {
          this.logger.debug(`Uploading chunks for ${params.name}:`, initResp);
          const offset = 0;
          const currentUploads = this.files.value;
          currentUploads.push(initResp);
          this.files.next(currentUploads);

          // Create a URL to the file blob and start the upload
          const chunkParams = { uploadId: initResp._id, offset, chunk: contents };
          this.fileService.fileReadChunk(chunkParams).subscribe((chunkResp: any) => {
            this.logger.debug(`Uploading chunk ${offset} of ${params.name}:`, chunkResp);
            if (chunkResp.size === upload.size) {
              this.logger.debug("Upload complete: ", chunkResp.name);
            }
            const files = this.files.value;
            const existing = files.find(file => file._id === chunkResp._id);
            const index = files.indexOf(existing);
            files[index] = chunkResp;
            this.files.next(files);
          });
        });
      });
    });
  }

  load(): void {
    if (this.currentFolderId) {
        // Fetch folders in the given folder
      this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder })
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });
        // Fetch items in the given folder
      this.itemService.itemFind({ folderId: this.currentFolderId })
                      .pipe(enterZone(this.zone))
                      .subscribe(items => {
                        this.files.next(items);
                      });

      return;
    }
    switch (this.currentNav) {
      case 'home':
        if (!this.homeRoot) { 
          this.logger.warn("Warning: Home root not detected. Delaying loading until it has been found:", this.homeRoot);

          return;
        }

        // Fetch folders in the home folder
        this.folderService.folderFind({ parentId: this.homeRoot._id, parentType: ParentType.Folder })
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });

        // Fetch items in the home folder
        this.itemService.itemFind({ folderId: this.homeRoot._id })
                        .pipe(enterZone(this.zone))
                        .subscribe(items => {
                          this.files.next(items);
                        });
        break;
      case 'external_data':
        if (!this.dataRoot) { 
          this.logger.warn("Warning: Data root not detected. Delaying loading until it has been found:", this.dataRoot);

          return;
        }
        // Fetch registered datasets
        const params = { myData: false };
        this.datasetService.datasetListDatasets(params)
                           .pipe(enterZone(this.zone))
                           .subscribe((value: Array<FileElement>) => {
          const matches: Array<FileElement> = [];
          // Map registered Datasets to the dataSet mounts on this Tale
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
        if (!this.tale || !this.tale.workspaceId) { 
          this.logger.warn("Warning: Tale or Tale workspace root not detected. Delaying loading until it has been found:", this.tale);

          return;
        }

        // Short-circuit for if we haven't loaded the tale yet
        // FIXME: Can we avoid this race condition in a more elegant way?
        if (this.tale.workspaceId) {
          // Load folder with id=tale.workspaceId
          this.currentFolderId = this.tale.workspaceId;

          // Fetch folders in the workspace
          this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder })
                            .subscribe(folders => {
                              this.zone.run(() => { this.folders.next(folders); });
                            });

          // Fetch items in the workspace
          this.itemService.itemFind({ folderId: this.currentFolderId })
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
        this.logger.warn("Unrecognized nav encountered:", this.currentNav);
        break;
    }
  }

  switchNav(nav: string): void {
    this.currentNav = nav;
    this.currentFolderId = undefined;
    this.currentRoot = undefined;
    this.currentPath = '';
    this.navigate();
  }

  isNavActive(nav: string): boolean {
    return this.currentNav === nav;
  }

  truncatePathSegments(path: string): string {
    const truncatedSegments: Array<string> = [];
    path.split('/').forEach((s: string) => {
      truncatedSegments.push(this.truncate.transform(s, 30));
    });

    return truncatedSegments.join('/');
  }

  setCurrentPath(): void {
    // Then set the current path
    const params = { id: this.currentRoot._id, type: this.currentRoot._modelType };
    this.resourceService.resourcePath(params)
                        .pipe(enterZone(this.zone))
                        .subscribe((resp: string) => {
      let pathSuffix: string;                    
      switch (this.currentNav) {
        case 'external_data':
          if (resp.indexOf(DATA_ROOT_PATH) !== -1) {
            pathSuffix = resp.split(DATA_ROOT_PATH)[1];
          } else {
            this.logger.error("Error: malformed resource path encountered... aborting:", resp);
          }
          break;
        case 'tale_workspace':
          if (resp.indexOf(this.taleId) !== -1) {
            pathSuffix = resp.split(this.taleId)[1];
          } else {
            this.logger.error("Error: malformed resource path encountered... aborting:", resp);
          }
          break;
        case 'home':
          if (resp.indexOf(HOME_ROOT_NAME) !== -1) {
            pathSuffix = resp.split(HOME_ROOT_NAME)[1];
          } else {
            this.logger.error("Error: malformed resource path encountered... aborting:", resp);
          }
          break;
        default:
          this.logger.error("Error: unexpected nav encountered... aborting:", this.currentNav);
          break;
      }

      if (pathSuffix) {
        this.currentPath = this.truncatePathSegments(pathSuffix);
      }
    });
  }

  setCurrentRoot(resourceId: string, modelType = 'folder'): void {
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
            this.logger.debug(`currentRoot is now: ${this.currentRoot.name}`);
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
            this.logger.debug(`currentRoot is now: ${this.currentRoot.name}`);
            this.setCurrentPath();
          });
          break;
        default:
          this.logger.error("Unrecognized model type encountered:", modelType);
          break;
      }
    } else {
      this.currentRoot = undefined;
      this.currentFolderId = undefined;
      this.canNavigateUp = false;
      this.currentPath = '';
    }
  }

  get placeholderMessage(): string {
      if (this.currentFolderId && this.currentNav === 'external_data') {
        // Set the placeholder to describe how to Create Folder or Upload File
        return 'This folder is empty, but Datasets are immutable and no folders/files can be added.';
      } else if (this.currentFolderId) {
        // Set the placeholder to describe how to Create Folder or Upload File
        return 'This folder is empty. Add a folder or file using the (+) button at the top-right.';
      } else if (this.currentNav === 'home') {
        return 'Your home folder is empty. Add a folder or file using the (+) button at the top-right.';
      } else if (this.currentNav === 'external_data') {
        // Set the placeholder to describe how to Register a Dataset with this Tale
        return 'This Tale does not have any datasets registered. Register a dataset to see it listed here.';
      } else if (this.currentNav === 'tale_workspace') {
        // Set the placeholder to describe how to Create Folder or Upload File
        return 'This Tale\'s workspace is empty. Add a folder or file using the (+) button at the top-right.';
      } else {
        // Set the placeholder to indicate an error
        return 'Something went horribly wrong.';
      }
  }

  getName(folder: FileElement): string {
    return folder.name;
  }

  addFolder(folder: { name: string }): void {
    const now = new Date();
    let parentId;

    // Datasets are immutable - prevent modifying them directly
    if (this.currentNav !== 'external_data') {
      // If we have a folderId, use that.. otherwise we can assume the root based on currentNav
      parentId = this.currentRoot ? this.currentFolderId : this.tale.workspaceId;
    }

    const params = {
      parentType: ParentType.Folder,
      parentId,
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

  removeElement(element: FileElement): void {
    if (element._modelType === 'folder') {
      // Element is a folder, delete it 
      this.folderService.folderDeleteFolder({ id: element._id })
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        this.logger.debug("Folder deleted successfully:", resp);
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
        this.logger.debug("Item deleted successfully:", resp);
        const files = this.files.value;
        const index = files.indexOf(element);
        files.splice(index, 1);
        this.files.next(files);
      });
    }
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }): void {
    const src = event.element;
    const dest = event.moveTo;
    const params = { id: src._id, parentId: dest._id };
    if (src._modelType === 'folder') {
      // Element is a folder, move it 
      this.folderService.folderUpdateFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        this.logger.debug("Folder moved successfully:", resp);
      });
    } else if (src._modelType === 'item') {
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        this.logger.debug("Item moved successfully:", resp);
      });
    }
  }

  renameElement(element: FileElement): void {
    const params = { id: element._id, name: element.name };
    if (element._modelType === 'folder') {
      // Element is a folder, move it 
      this.folderService.folderUpdateFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        this.logger.debug("Folder renamed successfully:", resp);
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
        this.logger.debug("Item renamed successfully:", resp);
        const files = this.files.value;
        const index = files.indexOf(element);
        files[index] = resp;
        this.files.next(files);
      });
    }
  }

  copyElement(element: FileElement): Promise<FileElement> {
    return new Promise((resolve, reject) => {
      const params = { id: element._id };
      if (element._modelType === 'folder') {
        this.folderService.folderCopyFolder(params)
                          .pipe(enterZone(this.zone))
                          .subscribe((resp: FileElement) => {
          this.logger.debug("Folder copied successfully:", resp);
          const folders = this.folders.value;
          folders.push(resp);
          this.folders.next(folders);
          resolve(resp);
        }, reject);
      } else if (element._modelType === 'item') {
        this.itemService.itemCopyItem(params)
                        .pipe(enterZone(this.zone))
                        .subscribe((resp:FileElement) => {
          this.logger.debug("Item copied successfully:", resp);
          const files = this.files.value;
          files.push(resp);
          this.files.next(files);
          resolve(resp);
        }, reject);
      }
    });
  }

  downloadElement(element: FileElement): void {
    if (element._modelType === 'folder') {
      const url = `${this.folderService.rootUrl}/${FolderService.folderDownloadFolderPath.replace('{id}', element._id)}?contentDisposition=attachment`;
      window.open(url, "_blank");
    } else if (element._modelType === 'item') {
      const url = `${this.itemService.rootUrl}/${ItemService.itemDownloadPath.replace('{id}', element._id)}?contentDisposition=attachment`;
      window.open(url, "_blank");
    }
  }
  
  
  // Expected parameter format:
  //    dataMap: [{"name":"Elevation per SASAP region and Hydrolic Unit (HUC8) boundary for Alaskan watersheds","dataId":"resource_map_doi:10.5063/F1Z60M87","repository":"DataONE","doi":"10.5063/F1Z60M87","size":10293583}]
  openRegisterDataModal(event: Event): void {
    const dialogRef = this.dialog.open(RegisterDataDialogComponent);
    dialogRef.afterClosed().subscribe((selectedResult: any) => {
      if (!selectedResult) { return; }
      const dataMap = JSON.stringify([selectedResult]);
      const params = { dataMap };
      this.datasetService.datasetImportData(params).subscribe(resp => {
        this.logger.info("Dataset registered:", resp);
      });
    });
  }
  
  openSelectDataModal(event: Event): void {
    const config: MatDialogConfig = {
      data: { tale: this.tale }
    };
    const dialogRef = this.dialog.open(SelectDataDialogComponent, config);
    dialogRef.afterClosed().subscribe((datasets: Array<Dataset>) => {
      if (!datasets) { return; }

      const tale = this.tale;
      tale.dataSet = [];
      datasets.forEach(ds => {
        // TODO: leading slash?
        tale.dataSet.push({ itemId: ds._id, mountPath: ds.name })
      });

      this.taleService.taleUpdateTale({ id: tale._id, tale }).subscribe(response => {
        this.logger.debug("Successfully updated Tale datasets:", response);
        this.load();
      }, err => {
        this.logger.error("Failed to update Tale:", err);
      });
    });
  }
  
  openTaleWorkspacesModal(event: Event): void {
    const config: MatDialogConfig = {
      data: { tale: this.tale }
    };
    const dialogRef = this.dialog.open(TaleWorkspacesDialogComponent, config);
    dialogRef.afterClosed().subscribe((result: { action: string, selected: Array<Selectable> }) => {
      if (!result) { return; }

      // Group resources by modelType
      const resources = {};
      result.selected.forEach(s => {
        if (!resources[s._modelType]) {
          resources[s._modelType] = [];
        }

        resources[s._modelType].push(s._id);
      });

      // Build up request parameters
      const params = { 
        resources: JSON.stringify(resources),
        parentType: ParentType.Folder,
        parentId: this.tale.workspaceId
      };

      // Determine which endpoint to hit based on the user's chosen "action"
      switch (result.action) {
        case 'move':
          // Move selected files to the current Tale's Workspace
          this.logger.debug('Moving folders/files to workspace:', result.selected);
          this.resourceService.resourceMoveResources(params).subscribe(resp => {
            this.logger.debug('Folders/files successfully moved to workspace:', resp);
          });
          break;
        case 'copy':
          // Copy selected files to the current Tale's Workspace
          this.logger.debug('Copying folders/files to workspace:', result.selected);
          this.resourceService.resourceCopyResources(params).subscribe(resp => {
            this.logger.debug('Folders/files successfully copied to workspace:', resp);
          });
          break;
        default:
          this.logger.error("Error: unexpected action encountered from TaleWorkspacesDialogComponent:", result);
          break;
      }
    });
  }

  navigate(): void {
    this.router.navigate(['run', this.taleId ], { 
      queryParamsHandling: "merge", 
      queryParams: { 
        tab: 'files',
        nav: this.currentNav, 
        parentid: this.currentFolderId ? this.currentFolderId : undefined,
      }
    });
    this.canNavigateUp = this.currentFolderId ? true : false;
  }

  // TODO: Parameterize to make path clickable?
  navigateUp(): void {
    // TODO: Allow user to navigate to root folders?
    // NOTE: we may need something like this for the Data Catalog, but doesn't need to be this same Component
    const isDataRoot = this.currentRoot.parentId === this.dataRoot._id;
    const isTaleWorkspaceRoot = this.currentRoot.parentId === this.tale.workspaceId;
    const isHomeRoot = this.currentRoot.parentId === this.homeRoot._id;

    // NOTE: This is currently unused, but may be needed
    const isWorkspaceRoot = this.currentRoot.parentId === this.wsRoot._id;

    // If we find that our parentId matches our known root folders, then we have reached the root
    if (this.currentRoot && (isDataRoot || isTaleWorkspaceRoot || isHomeRoot)) {
      this.currentRoot = undefined;
      this.currentFolderId = undefined;
      this.canNavigateUp = false;
      this.currentPath = '';
    } else {
      this.currentFolderId = this.currentRoot ? this.currentRoot.parentId : undefined;
    }
    this.navigate();
  }

  navigateToFolder(element: FileElement): void {
    this.setCurrentRoot(element._id);
    this.currentFolderId = element._id;
    this.navigate();
  }
}
