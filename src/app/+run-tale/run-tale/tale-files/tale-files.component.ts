import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfiguration } from '@api/api-configuration';
import { AccessLevel, Folder, Job, Run, Tale, Upload, User, Version } from '@api/models';
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
import { TokenService } from '@api/token.service';
import { FileElement } from '@files/models/file-element';
import { TruncatePipe } from '@shared/common/pipes/truncate.pipe';
import { enterZone, LogService } from '@shared/core';
import { ErrorModalComponent } from '@shared/error-handler/error-modal/error-modal.component';
import { CollaboratorList } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';
import { SyncService } from '@tales/sync.service';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import {
  RecordedRunInfoDialogComponent
} from '~/app/+run-tale/run-tale/modals/recorded-run-info-dialog/recorded-run-info-dialog.component';
import {
  TaleVersionInfoDialogComponent
} from '~/app/+run-tale/run-tale/modals/tale-version-info-dialog/tale-version-info-dialog.component';

import { RegisterDataDialogComponent } from '../modals/register-data-dialog/register-data-dialog.component';
import { SelectDataDialogComponent } from '../modals/select-data-dialog/select-data-dialog.component';
import { TaleWorkspacesDialogComponent } from '../modals/tale-workspaces-dialog/tale-workspaces-dialog.component';

// import * as $ from 'jquery';
declare var $: any;

// TODO: Is there a better place to store these constants?
const HOME_ROOT_NAME = 'Home';
const DATA_ROOT_PATH = '/collection/WholeTale Catalog/WholeTale Catalog';

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

interface Selectable {
  _modelType: string;
  _id: string;
  name: string;
}

const sortByUpdated = (a: any, b: any) => (a.updated > b.updated) ? -1 : (a.updated < b.updated) ? 1 : 0;

@Component({
  selector: 'app-tale-files',
  templateUrl: './tale-files.component.html',
  styleUrls: ['./tale-files.component.scss']
})
export class TaleFilesComponent implements OnInit, OnChanges, OnDestroy {
  filesToUpload: Array<File> = new Array<File>();
  currentUpload: FileElement;

  loading = false;

  AccessLevel: any = AccessLevel;

  @Input() tale: Tale;
  @Input() taleId: string;

  @Output() readonly taleUpdated = new EventEmitter<Tale>();
  @Output() readonly taleVersionChanged = new EventEmitter<Version>();

  @Input() collaborators: CollaboratorList;

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

  updateSubscription: Subscription;
  fetching = false;

  currentFolderForkJoinSub: Subscription;
  homeFolderForkJoinSub: Subscription;
  dataFolderForkJoinSub: Subscription;
  workspaceFolderForkJoinSub: Subscription;

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
    private config: ApiConfiguration,
    public tokenService: TokenService,
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

    // Fetch Data root, whether user is logged in or not
    this.resourceService.resourceLookup({ test: false, path: DATA_ROOT_PATH })
      .pipe(enterZone(this.zone))
      .subscribe(dataRoot => {
        this.dataRoot = dataRoot;
        this.load();
      });

    // Fetch Home root, if user is logged in
    this.userService.userGetMe()
      .pipe(enterZone(this.zone))
      .subscribe((user : User) => {
        if (user) {
          const homeRootParams = { parentId: user._id, parentType: ParentType.User, text: HOME_ROOT_NAME };
          this.folderService.folderFind(homeRootParams).pipe(enterZone(this.zone)).subscribe((homeFolderResults: Array<any>) => {
            if (homeFolderResults && homeFolderResults.length) {
              this.homeRoot = homeFolderResults[0];
            }
            this.load();
          });
        } else {
          this.logger.debug('Skipping loading home root since user is not logged in.')
        }
      });
  }

  ngOnChanges(): void {
    this.detectQueryString();
    this.load();
  }

  ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();

    this.folders.complete();
    this.files.complete();

    // RXjS docs say that this isn't necessary, but
    // without it we're getting multiple subscriptions firing
    this.currentFolderForkJoinSub?.unsubscribe();
    this.homeFolderForkJoinSub?.unsubscribe();
    this.dataFolderForkJoinSub?.unsubscribe();
    this.workspaceFolderForkJoinSub?.unsubscribe();
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

  sanitizeId(virtualId: string): string {
    return virtualId.replace(/=/g, '')
  }

  uploadChunk(uploadId: string, offset: number, chunk: Blob): Promise<any> {
    const chunkParams = { uploadId, offset, chunk };
    const chunkResp = this.fileService.fileReadChunk(chunkParams).toPromise();

    chunkResp.catch((err) => {
      this.logger.error("Failed to upload chunk:", err);
    });

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
      const percent = ((chunkResp.received ? +chunkResp.received : +upload.size) / +upload.size) * 100;
      $('#in-progress-upload-bar').progress('set percent', percent);
      if (existing) {
        existing.uploadProgress = percent;
      }
      this.ref.detectChanges();
    }
  }

  convertToArray(files: FileList): Array<File> {
    return Array.from(files);
  }

  uploadFolder(files: Array<File>): void {
    // Search to find base folder name
    files.some((file: File) => {
      // tslint:disable-next-line:no-string-literal
      const relPath = file['webkitRelativePath'];

      // NOTE: Relative path is only set for folder uploads
      if (relPath) {
        // Create a target folder - the assumption is that it's gonna live inside a virtual resource
        const folderName = relPath.split('/')[0];
        const params = { name: folderName, parentId: this.getParentId() };
        this.folderService.folderCreateFolder(params).subscribe(async (folder: Folder) => {
          await this.load();
          this.uploadFiles(files, folder);
          this.ref.detectChanges();
        });

        return true;
      } else {
        this.logger.error("Received request for directory upload without a relPath: ", file);
      }
    })
  }

  splitPath(path: string): string {
    return path.split('/').slice(0, -1).join("/");
  }

  // Returned _id will follow the convention: wtlocal:<..>
  // do something along the lines:
  //   payload = folder._id.split(":")[1]
  //   path_and_root = atob(payload)  // base64 decode
  //   path = path_and_root.split("|")[0]
  //   rootId = path_and_root.split("|")[1]
  // During upload reverse the above with updated path:
  //  fullPath = path + / + file.webkitRelativePath // note that 'name' shouldn't be the part of fullPath
  //  newpath_and_root = btoa( fullPath + "|" + rootId )
  buildVirtualParentId(file: File, folder: Folder, relPath: string): string {
    const payload = folder._id.split(":")[1];
    const [path, rootId] = atob(payload).split("|");   // base64 decode

    // repair overlapping/duplicated folder name within new path
    //    path=/path/in/girder/data/subdir
    //    relPath=subdir/path/to/file
    const newPath = `${this.splitPath(path)}/${relPath}`;  // remove parent folder from end of top path
    const newVirtualParent = this.splitPath(newPath);  // remove filename from end of new path

    return `wtlocal:${btoa(`${newVirtualParent}|${rootId}`)}`;
  }

  // Optionally takes a folder to upload to (for folder uploads ONLY)
  uploadFiles(files: Array<File>, folder?: Folder): void {
    files.forEach(f => this.filesToUpload.push(f));
    this.logger.debug(`${files.length} files added... upload queue contents:`, this.filesToUpload);

    (async () => {
      while (this.filesToUpload.length > 0) {
        // Grab next upload off the queue
        this.currentUpload = undefined;
        const currentFile = this.filesToUpload.shift();

        // If we're given a relPath and a folder, then this is a directory upload
        // Otherwise, we upload to the current folder
        // tslint:disable-next-line:no-string-literal
        const relPath = currentFile['webkitRelativePath'];
        const parentId = folder ? this.buildVirtualParentId(currentFile, folder, relPath) : this.getParentId();

        // POST /file with parentId = wtlocal:<newpath_and_root>, or else to current folder
        const initUploadParams = {
          parentId,
          parentType: UploadType.Folder,
          name: currentFile.name,
          size: currentFile.size,
          // chunk: contents
        };

        this.currentUpload = await this.fileService.fileInitUpload(initUploadParams).toPromise();

        // Add new file upload to the list
        // TODO: Progress updates / indicator
        const filesVal = this.files.value;
        this.currentUpload.uploadProgress = 0;
        this.currentUpload.uploading = true;

        if (parentId === this.getParentId()) {
          filesVal.push(this.currentUpload);
          this.files.next(filesVal);
        }

        const selector = '#in-progress-upload-bar';

        // Can't bind to [attr.data-percent].. use js to set total and update progress
        $(selector).progress('set percent', 0);
        this.currentUpload.uploadProgress = 0;
        this.ref.detectChanges();

        // This should be a blocking call
        await this.uploadChunks(this.currentUpload?._id, currentFile);

        // Once all chunks are uploaded, then the upload is complete
        this.logger.info(`Upload complete: ${currentFile.name} (${currentFile.size})`, currentFile);

        // Can't bind to [attr.data-percent].. use js to set total and update progress
        $(selector).progress('set percent', 100);
        this.currentUpload.uploadProgress = 100;
        this.currentUpload.uploading = false;

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

        setTimeout(() => {
          $('.ui.file.dropdown').dropdown({ action: 'hide' });
          this.load();
        }, 500);

        // Update UI with final uploaded item (logo, size, etc)
      }
    })();
  }


  load(): void {
    // Already loading, short-circuit
    if (this.loading) { return; }

    this.loading = true;

    if (this.currentFolderId) {
        // Fetch folders in the given folder
      const foldersFetch = this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder, limit: 0 });

        // Fetch items in the given folder
      const itemsFetch = this.itemService.itemFind({ folderId: this.currentFolderId, limit: 0 });

      this.currentFolderForkJoinSub = forkJoin([foldersFetch, itemsFetch]).pipe(enterZone(this.zone))
                                                  .subscribe((values: Array<any>) => {
                                                    this.folders.next(values[0]);
                                                    this.files.next(values[1]);
                                                    this.loading = false;
                                                    this.ref.detectChanges();
                                                  });

      return;
    }

    switch (this.currentNav) {
      case 'recorded_runs':
        this.runService.runListRuns({ taleId: this.taleId })
                       .pipe(enterZone(this.zone))
                       .subscribe((r: Array<Run>) => {
                         if (this.currentNav === 'recorded_runs') {
                           this.folders.next(r.sort(sortByUpdated));
                           this.files.next([]);
                           this.loading = false;
                           this.ref.detectChanges();
                         }
                       });
        break;
      case 'tale_versions':
        this.versionService.versionListVersions({ taleId: this.taleId })
                           .pipe(enterZone(this.zone))
                           .subscribe((v: Array<Version>) => {
                             if (this.currentNav === 'tale_versions') {
                               this.folders.next(v.sort(sortByUpdated));
                               this.files.next([]);
                               this.loading = false;
                               this.ref.detectChanges();
                             }
                           });
        break;
      case 'home':
        if (!this.homeRoot) {
          this.logger.warn("Warning: Home root not detected. Delaying loading until it has been found:", this.homeRoot);
          this.loading = false;

          return;
        }

        // Fetch folders in the home folder
        const homeFoldersFetch = this.folderService.folderFind({ parentId: this.homeRoot._id, parentType: ParentType.Folder, limit: 0 });

        // Fetch items in the home folder
        const homeItemsFetch = this.itemService.itemFind({ folderId: this.homeRoot._id, limit: 0 });

        this.homeFolderForkJoinSub = forkJoin([homeFoldersFetch, homeItemsFetch]).pipe(enterZone(this.zone)).subscribe((values: Array<any>) => {
          if (this.currentNav === 'home') {
            this.folders.next(values[0]);
            this.files.next(values[1]);
            this.loading = false;
            this.ref.detectChanges();
          }
        });
        break;
      case 'external_data':
        if (!this.dataRoot) {
          this.logger.warn("Warning: Data root not detected. Delaying loading until it has been found:", this.dataRoot);
          this.loading = false;

          return;
        }

        if (this.tale.dataSet.length === 0) {
          this.folders.next([]);
          this.files.next([]);
          this.loading = false;
          this.ref.detectChanges();

          return;
        }

        // Fetch registered datasets
        const sources = this.tale.dataSet.map(mount => {
          if (mount._modelType === 'folder') {
            return this.folderService.folderGetFolder(mount.itemId);
          } else {
            return this.itemService.itemGetItem(mount.itemId);
          }
        });

        this.dataFolderForkJoinSub = forkJoin(sources).pipe(enterZone(this.zone)).subscribe((values: Array<FileElement>) => {
          if (this.currentNav === 'external_data') {
            const folderMatches = values.filter(element => element._modelType === 'folder');
            const itemMatches = values.filter(element => element._modelType === 'item');

            this.folders.next(folderMatches);
            this.files.next(itemMatches);
            this.loading = false;
            this.ref.detectChanges();
          }
        });

        this.currentRoot = undefined;
        this.currentFolderId = undefined;
        this.canNavigateUp = false;
        this.currentPath = '';

        break;
      case 'tale_workspace':
        if (!this.tale || !this.tale.workspaceId) {
          this.logger.warn("Warning: Tale or Tale workspace root not detected. Delaying loading until it has been found:", this.tale);
          this.loading = false;

          return;
        }

        // Load folder with id=tale.workspaceId
        this.currentFolderId = this.tale.workspaceId;

        // Fetch folders in the workspace
        const workspaceFoldersFetch = this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder, limit: 0 });

        // Fetch items in the workspace
        const workspaceItemsFetch = this.itemService.itemFind({ folderId: this.currentFolderId, limit: 0 });

        this.workspaceFolderForkJoinSub = forkJoin([workspaceFoldersFetch, workspaceItemsFetch]).pipe(enterZone(this.zone)).subscribe((values: Array<any>) => {
          if (this.currentNav === 'tale_workspace') {
            this.folders.next(values[0]);
            this.files.next(values[1]);
            this.loading = false;
            this.ref.detectChanges();
          }
        });

        this.currentRoot = undefined;
        this.currentFolderId = undefined;
        this.canNavigateUp = false;
        this.currentPath = '';

        break;
      default:
        this.logger.warn("Unrecognized nav encountered:", this.currentNav);
        this.loading = false;

        break;
    }
  }

  switchNav(nav: string): void {
    this.currentNav = nav;
    this.currentFolderId = this.currentRoot = undefined;
    this.currentPath = '';
    this.navigate();
    this.ref.detectChanges();
  }

  isNavActive(nav: string): boolean {
    return this.currentNav === nav;
  }

  truncatePathSegments(path: string): string {
    return path.split('/').map((s: string) => this.truncate.transform(s, 30)).join("/");
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
    const setParams = (result: any) => {
      this.currentRoot = result;
      this.currentFolderId = this.currentRoot._id;
      this.canNavigateUp = !!this.currentRoot;
      this.logger.debug(`currentRoot is now: ${this.currentRoot.name}`);
      this.setCurrentPath();
      this.ref.detectChanges();
    }

    // Lookup and set our root node
    if (resourceId) {
      switch (modelType) {
        case 'folder':
          this.folderService.folderGetFolder(resourceId)
                            .pipe(enterZone(this.zone))
                            .subscribe(setParams.bind(this));
          break;
        case 'collection':
          this.collectionService.collectionGetCollection(resourceId)
                                .pipe(enterZone(this.zone))
                                .subscribe(setParams.bind(this));
          break;
        default:
          this.logger.error("Unrecognized model type encountered:", modelType);
          break;
      }
    } else {
      this.currentRoot = this.currentFolderId = undefined;
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

  getParentId(): string {
    // Upload to the current folder, if possible
    return this.currentFolderId ? this.currentFolderId :
      // Otherwise upload to "workspace" if we're on the Workspaces nav and have no currentFolderId, else upload to "Home" folder
      this.currentNav === 'tale_workspace' ? this.tale.workspaceId : this.homeRoot._id;
  }

  addFolder(folder: { name: string }): void {
    // Datasets are immutable - prevent modifying them directly
    if (this.currentNav === 'external_data') { return; }

    // Create in the current folder, if possible
    const params = {
      parentType: ParentType.Folder,
      parentId: this.getParentId(),
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
      err => this.dialog.open(ErrorModalComponent, { data: { error: err.error } }));
  }

  removeElement(element: FileElement): void {
    // Special handling for runs/versions
    if (this.currentNav === 'recorded_runs') {
      // No-op: remove not allowed within a run
      if (this.currentFolderId || this.canNavigateUp) { return; }
      this.runService.runDeleteRun(element._id).subscribe(resp => {
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });

      return;
    } else if (this.currentNav === 'tale_versions') {
      // No-op: remove not allowed within a version
      if (this.currentFolderId || this.canNavigateUp) { return; }
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
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    } else if (element._modelType === 'item') {
      // Element is an item, delete it
      this.itemService.itemDeleteItem(element._id)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        this.logger.debug("Item deleted successfully:", resp);
        this.load();
      }, err => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    }
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }): void {
    const src = event.element;
    const dest = event.moveTo;
    if (src._modelType === 'folder') {
      const params = { id: src._id, parentId: dest._id, parentType: ParentType.Folder, baseParentId: dest.baseParentId }
      // Element is a folder, move it
      this.folderService.folderUpdateFolder(params)
                        .pipe(enterZone(this.zone))
                        .subscribe(resp => {
        this.logger.info("Folder moved successfully:", resp);
        this.load();
      }, err => this.dialog.open(ErrorModalComponent, { data: { error: err.error } }));
    } else if (src._modelType === 'item') {
      const params = { id: src._id, folderId: dest._id, baseParentId: dest.baseParentId }
      // Element is an item, move it
      this.itemService.itemUpdateItem(params)
                      .pipe(enterZone(this.zone))
                      .subscribe(resp => {
        this.logger.info("Item moved successfully:", resp);
        this.load();
      }, err => this.dialog.open(ErrorModalComponent, { data: { error: err.error } }));
    }
  }

  renameElement(element: FileElement): void {
    const params = { id: element._id, name: element.name };

    // Special handling for runs/versions
    if (this.currentNav === 'recorded_runs') {

      // No-op: remove not allowed within a run
      if (this.canNavigateUp) { return; }
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
      // No-op: remove not allowed within a version
      if (this.canNavigateUp) { return; }
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
      this.folderService.folderUpdateFolder(params).pipe(enterZone(this.zone))
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
      this.itemService.itemUpdateItem(params).pipe(enterZone(this.zone))
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
        this.folderService.folderCopyFolder(params).pipe(enterZone(this.zone))
                          .subscribe((resp: FileElement) => {
          this.logger.debug("Folder copied successfully:", resp);
          const folders = this.folders.value;
          folders.push(resp);
          this.folders.next(folders);
          resolve(resp);
        }, reject);
      } else if (element._modelType === 'item') {
        this.itemService.itemCopyItem(params).pipe(enterZone(this.zone))
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
      this.datasetService.datasetImportData({ dataMap }).subscribe((resp: Job) => {
        this.logger.info('Dataset registered:', resp);
      }, (err: any) => {
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    });
  }

  openSelectDataModal(event: Event): void {
    const dialogRef = this.dialog.open(SelectDataDialogComponent, { data: { tale: this.tale } });
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
    const dialogRef = this.dialog.open(TaleWorkspacesDialogComponent, { data: { tale: this.tale } });
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
    this.canNavigateUp = !!this.currentFolderId;
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

  copyTaleVersionAsNewTale(taleVersionId: string): void {
    this.logger.debug("Cloning version into new Tale:", taleVersionId);
    this.taleService.taleCopyTale(this.tale._id, taleVersionId, true).subscribe((res: Tale) => {
      const newTaleId = res._id;

      // Router redirect here does not fully refresh the view
      this.router.navigate(['run', newTaleId], { queryParamsHandling: 'preserve' });
    }, err => {
      this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
    });
  }

  showInfo(element: FileElement): void {
    switch (this.currentNav) {
      case "recorded_runs":
        const run = element as Run;
        // TODO: Would be nice to also show the Run logs, but we don't know the Job ID
        this.versionService.versionGetVersion(run.runVersionId).subscribe((version: Version) => {
          this.dialog.open(RecordedRunInfoDialogComponent, {
            data: { run, version, tale: this.tale }
          });
        },err => {
          this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
        });
        break;
      case "tale_versions":
        const version = element as Version;
        this.dialog.open(TaleVersionInfoDialogComponent, {
          data: { version, tale: this.tale, collaborators: this.collaborators }
        });
        break;
      default:
        // no-op, should not be supported
        this.logger.warn(`Unsupported: Attempted to showInfo for element id=${element._id} modelType=${element._modelType}`)
        break;
    }
  }

  restoreVersion(version: Version): void {
    this.taleService.taleRestoreVersion(this.tale._id, version._id).subscribe(response => {
      this.logger.info("Tale version successfully restored");
      this.taleVersionChanged.emit(response);
    }, err => {
      this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
    });
    // TODO: Once they do this, how can the user get back to HEAD?
  }

  compareVersion(version: Version): void {
    // TODO: Show diff of this version with the current one
  }

  exportVersion(version: Version): void {
    const token = this.tokenService.getToken();
    const url = `${this.config.rootUrl}/tale/${this.tale._id}/export?token=${token}&taleFormat=bagit&versionId=${version._id}`;
    window.open(url, '_blank');
  }
}
