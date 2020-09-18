import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TaleNamePipe } from '@tales/pipes/tale-name.pipe';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

const URL = window['webkitURL'] || window.URL; // tslint:disable-line

// TODO: Is there a better place to store these constants?
const HOME_ROOT_NAME = 'Home';
const DATA_ROOT_PATH = '/collection/WholeTale Catalog/WholeTale Catalog';
const WORKSPACES_ROOT_PATH = '/collection/WholeTale Workspaces/WholeTale Workspaces';

const MAX_PATH_SEGMENT_LENGTH = 15;

const HOME_PATH_SEGMENT = 'Home';
const TALE_WORKSPACES_PATH_SEGMENT = 'Tale Workspaces';

enum ParentType {
  Folder = 'folder',
  Collection = 'collection',
  User = 'user'
}

@Component({
  templateUrl: './move-to-dialog.component.html',
  styleUrls: ['./move-to-dialog.component.scss']
})
export class MoveToDialogComponent implements OnInit {
  selectedFolder: FileElement;
  homeRoot: FileElement;
  wsRoot: FileElement;

  titleTruncateLength = 20;
  headTruncateLength = 40;
  bodyTruncateLength = 65;

  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);

  pathStack: Array<FileElement> = [];

  get currentFolderId(): string {
    const lastItem = this.currentRoot;
    if (!lastItem) {
      return undefined;
    }
    return lastItem._id;
  }

  get currentRoot(): FileElement {
    if (this.pathStack.length === 0) {
      return undefined;
    }

    const lastIndex = this.pathStack.length - 1;
    const lastItem = this.pathStack[lastIndex];
    return lastItem;
  }

  // NOTE: currently unused
  get currentPath(): string {
    return this.pathStack
      .map((e: FileElement) => {
        if (e._id === this.homeRoot._id) {
          return HOME_PATH_SEGMENT;
        } else if (e._id === this.wsRoot._id) {
          return TALE_WORKSPACES_PATH_SEGMENT;
        } else if (e.parentId === this.wsRoot._id) {
          // Fetch Tale via ID, then display its title
          return (async () => {
            const taleId = e.name;
            return this.taleNamePipe.transform(taleId).toPromise();
          })();
        } else {
          return e.name;
        }
      })
      .join('/');
  }

  get placeholderMessage(): string {
    if (this.pathStack.length === 2 && this.pathStack[0] === this.wsRoot) {
      return 'This Tale\'s Workspace is empty.'; // Empty Tale Workspace
    } else if (this.pathStack.length === 1 && this.pathStack[0] === this.wsRoot) {
      return 'You have not created any Tales.'; // Empty Tale Workspaces folder
    } else if (this.pathStack.length === 1 && this.pathStack[0] === this.homeRoot) {
      return 'Your Home folder is empty.'; // Empty home folder placeholder
    } else {
      return 'This folder is empty.'; // Empty generic sub-folder
    }
  }

  constructor(
    private readonly zone: NgZone,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly logger: LogService,
    private readonly folderService: FolderService,
    private readonly collectionService: CollectionService,
    private readonly itemService: ItemService,
    private readonly workspaceService: WorkspaceService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly taleService: TaleService,
    private readonly resourceService: ResourceService,
    private readonly taleNamePipe: TaleNamePipe,
    @Inject(MAT_DIALOG_DATA) public data: { elementToMove: FileElement }
  ) {}

  ngOnInit(): void {
    // Fetch Home root
    this.userService.userGetMe().subscribe((user: User) => {
      const homeRootParams = { parentId: user._id, parentType: ParentType.User, text: HOME_ROOT_NAME };
      const wsRootParams = { test: false, path: WORKSPACES_ROOT_PATH };

      const homeFind = this.folderService.folderFind(homeRootParams);
      const wsFind = this.resourceService.resourceLookup(wsRootParams);

      // Fetch all root folders before loading
      forkJoin(homeFind, wsFind)
        .pipe(enterZone(this.zone))
        .subscribe((value: Array<any>) => {
          if (value.length < 2) {
            this.logger.error('Error: Value mismatch when fetching root folders');
          }

          const homeFolderResults = value[0];

          if (homeFolderResults && homeFolderResults.length) {
            this.homeRoot = homeFolderResults[0];
          }

          this.wsRoot = value[1];

          this.load();
        });
    });
  }

  load(): void {
    if (!this.currentFolderId) {
      // Home folder actually works withthis same logic
      return;
    }

    // Fetch folders in the current folder
    this.folderService
      .folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder })
      .pipe(enterZone(this.zone))
      .subscribe(folders => {
        this.folders.next(folders);
      });
    // Fetch items in the current folder
    this.itemService
      .itemFind({ folderId: this.currentFolderId })
      .pipe(enterZone(this.zone))
      .subscribe(items => {
        this.files.next(items);
      });
  }

  // De-select folder, push to path, and reload list
  navigate(elem: FileElement): void {
    if (!elem || elem._modelType !== 'folder') {
      this.logger.warn('Attempted to navigate into a non-folder: ', elem);
      return;
    }

    this.selectedFolder = undefined;
    this.pathStack.push(elem);
    this.load();
  }

  // De-select folder, pop from path, and reload list
  navigateUp(): void {
    if (!this.pathStack.length) {
      this.logger.warn('Attempted to pop from empty path: ', this.pathStack);
      return;
    }

    this.selectedFolder = undefined;
    const poppedItem = this.pathStack.pop();
    this.load();
  }

  // Select folder
  selectFolder(elem: FileElement) {
    if (!elem || elem._modelType !== 'folder') {
      this.logger.warn('Attempted to select a non-folder: ', elem);
      return;
    } else if (elem._id === this.data.elementToMove._id) {
      this.logger.warn('Attempted to move the current item into itself: ', elem);
      return;
    }
    this.selectedFolder = elem;
  }
}
