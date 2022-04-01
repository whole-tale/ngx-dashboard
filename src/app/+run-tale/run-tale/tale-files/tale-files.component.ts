import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessLevel, Folder, Run, Tale, User, Version } from '@api/models';
import {
  CollectionService,
  DatasetService,
  FileService,
  FolderService,
  ItemService,
  ResourceService,
  RunService,
  TaleService,
  UserService,
  VersionService
} from '@api/services';
import { FileElement } from '@files/models/file-element';
import { TruncatePipe } from '@shared/common/pipes/truncate.pipe';
import { enterZone, LogService } from '@shared/core';
import { ErrorModalComponent } from '@shared/error-handler/error-modal/error-modal.component';
import { SyncService } from '@tales/sync.service';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';

import { RegisterDataDialogComponent } from '../modals/register-data-dialog/register-data-dialog.component';
import { SelectDataDialogComponent } from '../modals/select-data-dialog/select-data-dialog.component';
import { TaleWorkspacesDialogComponent } from '../modals/tale-workspaces-dialog/tale-workspaces-dialog.component';

// import * as $ from 'jquery';
declare var $: any;

const URL = window['webkitURL'] || window.URL;  // tslint:disable-line

// TODO: Is there a better place to store these constants?
const HOME_ROOT_NAME = 'Home';
const DATA_ROOT_PATH = '/collection/WholeTale Catalog/WholeTale Catalog';
const WORKSPACES_ROOT_PATH = '/collection/WholeTale Workspaces/WholeTale Workspaces';
const VERSIONS_ROOT_PATH = '/collection/WholeTale Tale Versions/WholeTale Tale Versions';
const RUNS_ROOT_PATH = '/collection/WholeTale Tale Runs/WholeTale Tale Runs';

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
  name: string;
}

@Component({
  selector: 'app-tale-files',
  templateUrl: './tale-files.component.html',
  styleUrls: ['./tale-files.component.scss']
})
export class TaleFilesComponent implements OnInit, OnChanges {
  uploadQueue: Set<File> = new Set();

  AccessLevel: any = AccessLevel;

  @Input() tale: Tale;
  @Input() taleId: string;

  @Output() readonly taleUpdated = new EventEmitter<Tale>();

  homeRoot: FileElement;
  dataRoot: FileElement;

  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  currentFolderId: string;

  currentRoot: FileElement;
  currentPath = '';
  canNavigateUp = false;

  currentNav = 'tale_workspace';
  highlighted = "";

  runs: BehaviorSubject<Array<Run>> = new BehaviorSubject<Array<Run>>([]);
  versions: BehaviorSubject<Array<Version>> = new BehaviorSubject<Array<Version>>([]);

  updateSubscription: Subscription;
  fetching = false;

  constructor(
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LogService,
    private folderService: FolderService,
    private syncService: SyncService,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private datasetService: DatasetService,
    private fileService: FileService,
    private userService: UserService,
    private taleService: TaleService,
    private resourceService: ResourceService,
    private runService: RunService,
    private versionService: VersionService,
    private truncate: TruncatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.detectQueryString();

    this.updateSubscription = this.syncService.taleUpdatedSubject.subscribe((taleId) => {
      this.logger.info("Updating Tale Files from SyncService: ", taleId);
      if (taleId === this.taleId && !this.fetching) {
        this.fetching = true;
        setTimeout(() => {
          this.logger.info("Tale Files update applied via SyncService: ", taleId);
          this.load();
          this.fetching = false;
        }, 1000);
      }
    });

    // Fetch Home root
    this.userService.userGetMe().subscribe((user : User) => {
      const homeRootParams = { parentId: user._id, parentType: ParentType.User, text: HOME_ROOT_NAME };
      const dataRootParams = { test: false, path: DATA_ROOT_PATH };

      const homeFind = this.folderService.folderFind(homeRootParams);
      const dataFind = this.resourceService.resourceLookup(dataRootParams);

      // Fetch all root folders before loading
      forkJoin([homeFind, dataFind]).pipe(enterZone(this.zone)).subscribe((value: Array<any>) => {
        if (value.length < 2) {
          this.logger.error("Error: Value mismatch when fetching root folders");
        }

        const homeFolderResults = value[0];

        if (homeFolderResults && homeFolderResults.length) {
          this.homeRoot = homeFolderResults[0];
        }

        this.dataRoot = value[1];

        this.load();
      });
    });
  }

  ngOnChanges(): void {
    this.detectQueryString();
    this.load();
  }

  readOnly(): boolean {
    return this.tale._accessLevel <= AccessLevel.Read || (this.currentNav === 'recorded_runs' || this.currentNav === 'tale_versions') && this.canNavigateUp;
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

      const highlight = params.highlight || undefined;
      if (highlight && this.highlighted !== highlight) {
        this.highlighted = highlight;
        setTimeout(() => {
          this.router.navigate([], { relativeTo: this.route, queryParams: { highlight: undefined, nav: params.nav, tab: params.tab }, queryParamsHandling: 'merge' });
        }, 2000);
      }

      this.load();
    });
  }

  uploadChunk(uploadId: string, offset: number, chunk: Blob): Promise<any> {
    const chunkParams = { uploadId, offset, chunk };
    const chunkResp = this.fileService.fileReadChunk(chunkParams).toPromise();

    chunkResp.catch((err) => {
      this.logger.error("Failed to upload chunk:", err);
    });
    // Update file size as upload progresses
    // TODO: File upload progress updates
    // const files = this.files.value;
    // const existing = files.find(file => file._id === uploadId);
    // if (existing) {
    //   const index = files.indexOf(existing);
    //   files[index] = chunkResp;
    // } else {
    //   files.push(chunkResp);
    // }
    // this.files.next(files);
    // this.ref.detectChanges();

    return chunkResp;
  }

  delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Girder default chunk size is 67108864?
  async uploadChunks(uploadId: string, upload: File, chunkSize = 67108863): Promise<any> { // = 10000000) {
    const numChunks = Math.ceil(upload.size / chunkSize);
    this.logger.info(`Beginning upload of ${upload.name} (${upload.size} bytes in ${numChunks} chunks):`, upload);

    const existing: FileElement = this.files.value.find(file => uploadId === file._id);

    for (let offset = 0; offset < upload.size; offset += (chunkSize + 1)) {
      // Upload the file blob one slice/chunk at a time
      const start = offset;
      const end = offset + chunkSize + 1;
      const chunk = upload.slice(start, end);

      this.logger.debug(`Uploading ${start} - ${end - 1} / ${upload.size} bytes (${start/(chunkSize + 1) + 1} / ${numChunks} chunks)`);
      const chunkResp = await this.uploadChunk(uploadId, offset, chunk);
      this.logger.info(`Uploaded ${chunkResp.received ? chunkResp.received : upload.size} / ${upload.size} bytes (${start/(chunkSize + 1) + 1} / ${numChunks} chunks):`, chunkResp);

      // Can't bind to [attr.data-percent].. use js to set total and update progress
      const percent =  ((chunkResp.received ? +chunkResp.received : +upload.size) / +upload.size) * 100;
      $(`#upload-${uploadId}`).progress('set percent', percent);
      existing.uploadProgress = percent;
      this.ref.detectChanges();
    }
  }

  uploadFolder(filesToUpload: { [key: string]: File }): void {
    // FIXME: annoying scope issue doesn't allow us to use this parameter value in the rxjs callback
    // FIXME: create a copy instead for now
    const filesQueue: { [key: string]: File } = {};
    for (const key in filesToUpload) {
      if (!isNaN(parseInt(key, 10))) {
        filesQueue[key] = filesToUpload[key];
      }
    }
    // KK: Create a target folder. The assumption is that it's gonna live inside a
    // virtual resource. Returned _id will follow the convention: wtlocal:<..>
    // do something along the lines:
    //   payload = folder._id.split(":")[1]
    //   path_and_root = atob(payload)  // base64 decode
    //   path = path_and_root.split("|")[0]
    //   rootId = path_and_root.split("|")[1]
    // During upload reverse the above with updated path:
    //  fullPath = path + / + file.webkitRelativePath // note that 'name' shouldn't be the part of fullPath
    //  newpath_and_root = btoa( fullPath + "|" + rootId )
    // POST /file with parentId = wtlocal:<newpath_and_root>

    // Search to find base folder name
    for (const key in filesToUpload) {
      if (!isNaN(parseInt(key, 10))) {
        const file = filesToUpload[key];
        // tslint:disable-next-line:no-string-literal
        const relPath = file['webkitRelativePath'];
        const folderName = relPath.split('/')[0];

        // NOTE: Relative path is only set for folder uploads
        if (relPath) {
          // Create top-level folder
          const params = { name: folderName, parentId: this.getParentId() };
          this.logger.error("Creating folder: ", folderName);
          this.folderService.folderCreateFolder(params).subscribe((folder: Folder) => {
            this.logger.error(`Folder created, starting upload...`);
            this.uploadFiles(filesQueue, folder);
          });
          break;
        } else {
          this.logger.error("Received request for directory upload without a relPath: ", file);
        }
      }
    }
  }

  getVirtualParentId(file: File, folder: Folder, relPath: string): string {
    const payload = folder._id.split(":")[1];
    this.logger.error("Decoding old path: ", payload)
    const pathWithRoot = atob(payload);    // base64 decode
    const segments = pathWithRoot.split("|");
    const path = segments[0];
    const rootId = segments[1];
    const newPath = `${path}/${relPath}`.replace(`${folder.name}/${folder.name}`, `${folder.name}`).replace(`/${file.name}`, '');
    this.logger.error("Decoded new/full path: ", newPath)
    const newPathWithRoot = btoa(`${newPath}|${rootId}`);

    return `wtlocal:${newPathWithRoot}`;
  }

  // Optionally takes a folder to upload to (Folder uploads ONLY)
  uploadFiles(filesToUpload: { [key: string]: File }, folder?: Folder): void {
    this.logger.error(`Uploading files now...`);

    for (const key in filesToUpload) {
      if (!isNaN(parseInt(key, 10))) {
        const file = filesToUpload[key];
        // tslint:disable-next-line:no-string-literal
        this.logger.error(`Uploading ${file['webkitRelativePath']}...`);
        this.uploadQueue.add(file);
      }
    }
    this.logger.debug(`${filesToUpload.length} files added... upload queue contents:`, this.uploadQueue);

    this.uploadQueue.forEach(upload => {
      // If we're given a relPath and a folder, then this is a directory upload
      // Otherwise, we upload to the current folder
      // tslint:disable-next-line:no-string-literal
      const relPath = upload['webkitRelativePath'];
      const parentId = folder ? this.getVirtualParentId(upload, folder, relPath) : this.getParentId();

      const initUploadParams = {
        parentId,
        parentType: UploadType.Folder,
        name: upload.name,
        size: upload.size,
        // chunk: contents
      };

      this.logger.error(`Uploading ${relPath} to: `, parentId);

      this.fileService.fileInitUpload(initUploadParams).subscribe(async (initResp: any) => {
        const uploadId = initResp._id;

        // Add new file upload to the list
        // TODO: Progress updates / indicator
        const files = this.files.value;
        initResp.uploadProgress = 0;
        initResp.uploading = true;
        files.push(initResp);
        this.files.next(files);

        // Can't bind to [attr.data-percent].. use js to set total and update progress
        $(`#upload-${uploadId}`).progress('set percent', 0);
        this.ref.detectChanges();

        // This should be a blocking call
        await this.uploadChunks(uploadId, upload);

        // Once all chunks are uploaded, then the upload is complete
        this.logger.info(`Upload complete: ${upload.name} (${upload.size})`, upload);

        // Can't bind to [attr.data-percent].. use js to set total and update progress
        $(`#upload-${uploadId}`).progress('set percent', 100);
        initResp.uploading = false;

        setTimeout(() => {
          $('.ui.file.dropdown').dropdown({ action: 'hide' });
        }, 500);
        this.ref.detectChanges();

        // This is apparently not needed all the time? Files are weird...
        // this.fileService.fileFinalizeUpload(uploadId).subscribe(finalResp => {
        //    // Update with final uploaded item
        //   const files = this.files.value;
        //   const existing = files.find(file => file._id === uploadId);
        //   const index = files.indexOf(existing);
        //   files[index] = finalResp;
        //   this.files.next(files);
        //   this.ref.detectChanges();
        // })

        // Update UI with final uploaded item (logo, size, etc)
        this.load();
      });

      this.uploadQueue.delete(upload);
    });
  }

  load(): void {
    if (this.currentFolderId) {
        // Fetch folders in the given folder
      this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder, limit: 0 })
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });
        // Fetch items in the given folder
      this.itemService.itemFind({ folderId: this.currentFolderId, limit: 0 })
                      .pipe(enterZone(this.zone))
                      .subscribe(items => {
                        this.files.next(items);
                      });

      return;
    }
    const sortByUpdated = (a: any, b: any) => {
      if (a.updated > b.updated) {
        return -1;
      } else if (a.updated < b.updated) {
        return 1;
      } else {
        return 0;
      }
    }

    switch (this.currentNav) {
      case 'recorded_runs':
        this.runService.runListRuns({ taleId: this.taleId })
                       .pipe(enterZone(this.zone))
                       .subscribe((r: Array<Run>) => {
                         this.folders.next(r.sort(sortByUpdated));
                         this.files.next([]);
                         this.ref.detectChanges();
                       });
        break;
      case 'tale_versions':
        this.versionService.versionListVersions({ taleId: this.taleId })
                           .pipe(enterZone(this.zone))
                           .subscribe((v: Array<Version>) => {
                             this.folders.next(v.sort(sortByUpdated));
                             this.files.next([]);
                             this.ref.detectChanges();
                           });
        break;
      case 'home':
        if (!this.homeRoot) {
          this.logger.warn("Warning: Home root not detected. Delaying loading until it has been found:", this.homeRoot);

          return;
        }

        // Fetch folders in the home folder
        this.folderService.folderFind({ parentId: this.homeRoot._id, parentType: ParentType.Folder, limit: 0 })
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });

        // Fetch items in the home folder
        this.itemService.itemFind({ folderId: this.homeRoot._id, limit: 0 })
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
        const promises: Array<Promise<any>> = [];

        const folderMatches: Array<FileElement> = [];
        const itemMatches: Array<FileElement> = [];

        // Map registered Datasets to the dataSet mounts on this Tale
        this.tale.dataSet.forEach(mount => {
          let promise;
          if (mount._modelType === 'folder') {
            promise = this.folderService.folderGetFolder(mount.itemId).toPromise().then((folder) => {
              folderMatches.push(folder);
            });
            promises.push(promise);
          } else if (mount._modelType === 'item') {
            promise = this.itemService.itemGetItem(mount.itemId).toPromise().then((item) => {
              itemMatches.push(item);
            });
            promises.push(promise);
          } else {
            this.logger.error('Unrecognized modelType', mount._modelType);
          }
        });

        Promise.all(promises).then(() => {
          this.zone.run(() => {
            this.folders.next(folderMatches);
            this.files.next(itemMatches);
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
          this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder, limit: 0 })
                            .subscribe(folders => {
                              this.zone.run(() => { this.folders.next(folders); });
                            });

          // Fetch items in the workspace
          this.itemService.itemFind({ folderId: this.currentFolderId, limit: 0 })
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
    this.ref.detectChanges();
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
        case 'home':
          if (resp.indexOf(HOME_ROOT_NAME) !== -1) {
            pathSuffix = resp.split(HOME_ROOT_NAME)[1];
          } else {
            this.logger.error("Error: malformed resource path encountered... aborting:", resp);
          }
          break;
        case 'recorded_runs':
        case 'tale_versions':
        case 'tale_workspace':
          if (resp.indexOf(this.taleId) !== -1) {
            pathSuffix = resp.split(this.taleId)[1];
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

      this.ref.detectChanges();
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

    this.ref.detectChanges();
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
      } else if (this.currentNav === 'tale_versions') {
        // Set the placeholder to describe how to Create Folder or Upload File
        return 'This Tale has no previous versions saved. Click the history button at the top-right of this panel to view and save versions.';
      } else if (this.currentNav === 'recorded_runs') {
        // Set the placeholder to describe how to Create Folder or Upload File
        return 'This Tale has not yet recorded any runs. Click the history button at the top-right of this panel to save a version and record a run.';
      } else {
        // Set the placeholder to indicate an error
        return 'Something went horribly wrong.';
      }
  }

  trackById(model: any, index: number): string {
    return model._id;
  }

  getName(folder: FileElement): string {
    return folder.name;
  }

  getParentId(): string {

    // Upload to the current folder, if possible
    const parentId = this.currentFolderId ? this.currentFolderId :
      // Otherwise upload to "workspace" if we're on the Workspaces nav and have no currentFolderId, else upload to "Home" folder
      this.currentNav === 'tale_workspace' ? this.tale.workspaceId : this.homeRoot._id;

      return parentId;
  }

  addFolder(folder: { name: string }): void {
    // Datasets are immutable - prevent modifying them directly
    if (this.currentNav === 'external_data') {
      return;
    }

    const now = new Date();

    // Upload to the current folder, if possible
    const parentId = this.getParentId();

    const params = {
      parentType: ParentType.Folder,
      parentId,
      name: folder.name,
      description: ""
    };

    this.folderService.folderCreateFolder(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(
      newFolder => {
        const folders = this.folders.value;
        folders.push(newFolder);
        this.folders.next(folders);
      },
      err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      }
    );
  }

  removeElement(element: FileElement): void {
    // Special handling for runs/versions
    if (this.currentNav === 'recorded_runs') {
      if (this.currentFolderId || this.canNavigateUp) {
        // No-op: remove not allowed within a run
        return;
      }

      this.runService.runDeleteRun(element._id).subscribe(resp => {
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });

      return;
    } else if (this.currentNav === 'tale_versions') {
      if (this.currentFolderId || this.canNavigateUp) {
        // No-op: remove not allowed within a version
        return;
      }

      this.versionService.versionDeleteVersion(element._id).subscribe(resp => {
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });

      return;
    }

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
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
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
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    }
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }): void {
    const src = event.element;
    const dest = event.moveTo;;
    if (src._modelType === 'folder') {
      const params = { id: src._id, parentId: dest._id, parentType: ParentType.Folder, baseParentId: dest.baseParentId }
      // Element is a folder, move it
      this.folderService.folderUpdateFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        this.logger.info("Folder moved successfully:", resp);
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    } else if (src._modelType === 'item') {
      const params = { id: src._id, folderId: dest._id, baseParentId: dest.baseParentId }
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        this.logger.info("Item moved successfully:", resp);
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    }
  }

  renameElement(element: FileElement): void {
    const params = { id: element._id, name: element.name };

    // Special handling for runs/versions
    if (this.currentNav === 'recorded_runs') {
      if (this.canNavigateUp) {
        // No-op: remove not allowed within a run
        return;
      }

      this.runService.runPutRenameRun(params.id, params.name).subscribe(resp => {
        this.load();
      }, err => {
        // Rename failed, roll-back the change
        element.name = element.prevName;
        this.ref.detectChanges();
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });

      return;
    } else if (this.currentNav === 'tale_versions') {
      if (this.canNavigateUp) {
        // No-op: remove not allowed within a version
        return;
      }

      this.versionService.versionPutRenameVersion(params.id, params.name).subscribe(resp => {
        this.load();
      }, err => {
        // Rename failed, roll-back the change
        element.name = element.prevName;
        this.ref.detectChanges();
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });

      return;
    }

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

        setTimeout(() => {
          $('.ui.file.dropdown').dropdown({ action: 'hide' });
        }, 500);
      }, err => {
        // Rename failed, roll-back the change
        element.name = element.prevName;
        this.ref.detectChanges();
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
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

        setTimeout(() => {
          $('.ui.file.dropdown').dropdown({ action: 'hide' });
        }, 500);
      }, err => {
        // Rename failed, roll-back the change
        element.name = element.prevName;
        this.ref.detectChanges();
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
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
    dialogRef.afterClosed().subscribe((datasets: Array<Selectable>) => {
      if (!datasets) { return; }

      const tale = this.tale
      const id = tale._id;
      tale.dataSet = datasets.map(ds =>
        ({ itemId: ds._id, mountPath: ds.name, _modelType: ds._modelType }));

      this.taleService.taleUpdateTale({ id, tale }).subscribe(response => {
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
    const isDataRoot = this.currentNav === 'external_data' && this.currentRoot.parentId === this.dataRoot._id;
    const isTaleWorkspaceRoot = this.currentNav === 'tale_workspace' && this.currentRoot.parentId === this.tale.workspaceId;
    const isHomeRoot = this.currentNav === 'home' && this.currentRoot.parentId === this.homeRoot._id;
    const isVersionsRoot = this.currentNav === 'tale_versions' && this.currentRoot.parentId === this.tale.versionsRootId;
    const isRunsRoot = this.currentNav === 'recorded_runs' && this.currentRoot.parentId === this.tale.runsRootId;

    // If we find that our parentId matches our known root folders, then we have reached the root
    if (this.currentRoot && (isDataRoot || isTaleWorkspaceRoot || isHomeRoot || isVersionsRoot || isRunsRoot)) {
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
