import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessLevel } from '@api/models/access-level';
import { Tale } from '@api/models/tale';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { ResourceService } from '@api/services/resource.service';
import { TaleService } from '@api/services/tale.service';
import { FileElement } from '@files/models/file-element';
import { LogService }  from '@framework/core/log.service';
import { TruncatePipe } from '@framework/core/truncate.pipe';
import { enterZone }  from '@framework/ngrx';
import { BehaviorSubject } from 'rxjs';

enum ParentType {
    Folder = "folder",
    Collection = "collection",
    User = "user"
}

interface Selectable {
  _modelType: string;
  _id: string;
}

@Component({
  templateUrl: './tale-workspaces-dialog.component.html',
  styleUrls: ['./tale-workspaces-dialog.component.scss']
})
export class TaleWorkspacesDialogComponent implements OnInit {
  selectedNav = 'tale_workspaces';

  isSingleClick = false;

  selectedTale: Tale;
  currentRoot: FileElement;
  currentFolderId: string;
  canNavigateUp = false;
  currentPath = '';

  // File browser contents
  tales: Array<Tale> = [];
  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);

  selected: Array<Selectable> = [];

  constructor(
    private zone: NgZone,
    private logger: LogService,
    private taleService: TaleService,
    private itemService: ItemService,
    private folderService: FolderService,
    private resourceService: ResourceService,
    private truncate: TruncatePipe,
    @Inject(MAT_DIALOG_DATA) public data: { tale: Tale }) {

  }

  get move(): { action: string, selected: Array<Selectable> }  {
    return { action: 'move', selected: this.selected };
  }

  get copy(): { action: string, selected: Array<Selectable> } {
    return { action: 'copy', selected: this.selected };
  }

  ngOnInit(): void {
    const params = { level: AccessLevel.Read };
    const currentTaleId = this.data.tale._id;
    this.taleService.taleListTales(params).subscribe((tales: Array<Tale>) => {
      // Filter out our destination Tale
      this.tales = tales.filter(t => t._id !== currentTaleId);
    }, err => {
      this.logger.error("Failed to fetch Tales:", err)
    });
  }

  isSelected(elem: Selectable): Selectable {
    return this.selected.find(e => e._id === elem._id);
  }

  selectTale(tale: Tale): void {
    this.selectedTale = tale;
    this.setCurrentRoot(this.selectedTale.workspaceId);
    this.load();
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
    } else if (this.selectedTale) {
      // Load folder with id=tale.workspaceId
      this.currentFolderId = this.selectedTale.workspaceId;

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
    }
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

  toggledCheckbox(e: any, sel: Selectable): void {
    // Debounce single-click handler
    this.isSingleClick = true;
    setTimeout(()=>{
      if (this.isSingleClick) {
        const index = this.selected.indexOf(sel);
        if (index === -1) {
          this.selected.push(sel);
        } else {
          this.selected.splice(index, 1);
        }
      }
    }, 250);
  }

  trackById(index: number, model: any): string {
    return model._id;
  }

  isNavActive(nav: string): boolean {
    return this.selectedNav === nav;
  }

  activateNav(nav: string): void {
    this.selectedNav = nav;
  }

  navigateUp(): void {
    if (this.currentFolderId === this.selectedTale.workspaceId) {
      // All the way up - show Tale list
      this.currentRoot = undefined;
      this.selectedTale = undefined;
      this.currentFolderId = undefined;
      this.canNavigateUp = false;
      this.currentPath = '';
    } else {
      this.currentFolderId = this.currentRoot ? this.currentRoot.parentId : undefined;
      this.setCurrentRoot(this.currentFolderId);
    }

    this.load();
  }

  navigateToFolder(elem: FileElement): void {
    this.isSingleClick = false;
    if (elem._modelType !== 'folder') {
      return;
    }
    this.setCurrentRoot(elem._id);
    this.currentFolderId = elem._id;
    this.load();
  }
}
