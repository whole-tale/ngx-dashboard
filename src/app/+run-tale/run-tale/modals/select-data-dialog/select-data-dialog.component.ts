import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dataset } from '@api/models/dataset';
import { Tale } from '@api/models/tale';
import { DatasetService } from '@api/services/dataset.service';
import { FolderService } from '@api/services/folder.service';
import { ItemService } from '@api/services/item.service';
import { FileElement } from '@files/models/file-element';
import { LogService }  from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { BehaviorSubject, Observable } from 'rxjs';

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
interface Selection {
  _modelType: string;
  mountPath: string;
  itemId: string;
}

@Component({
  templateUrl: './select-data-dialog.component.html',
  styleUrls: ['./select-data-dialog.component.scss']
})
export class SelectDataDialogComponent implements OnInit {
  selectedNav = 'mine';
  allDatasets: Observable<Array<Dataset>>;
  myDatasets: Observable<Array<Dataset>>;
  datasets: Observable<Array<Dataset>>;

  addedDatasets: BehaviorSubject<Array<Selectable>> = new BehaviorSubject<Array<Selectable>>([]);
  datasetsToAdd: Array<Selectable> = [];
  datasetsToRemove: Array<Selectable> = [];

  isSingleClick = false;

  selectedDataset: Dataset;
  currentFolderId: string;
  currentRoot: FileElement;
  canNavigateUp = false;
  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);

  selected: Array<Selectable> = [];

  constructor(
    private logger: LogService,
    private zone: NgZone,
    private datasetService: DatasetService,
    private folderService: FolderService,
    private itemService: ItemService,
    @Inject(MAT_DIALOG_DATA) public data: { tale: Tale }
  ) {}

  ngOnInit(): void {
    this.allDatasets = this.datasetService.datasetListDatasets({ myData: false });
    this.datasets = this.myDatasets = this.datasetService.datasetListDatasets({ myData: true });

    let preAddedDatasets = this.data.tale.dataSet.map((ds: { itemId: string, mountPath: string, _modelType: string }) => {
      // Lookup the Dataset by id and push it to our selection
      return { _modelType: ds._modelType, _id: ds.itemId, name: ds.mountPath };
    });

    this.addedDatasets.next(preAddedDatasets);
  }

  addSelectedDatasets(): void {
    const added = this.addedDatasets.value;
    // Filter anything already added
    const filtered = this.datasetsToAdd.filter(dataToAdd => !added.find(prevAddedData => dataToAdd._id === prevAddedData._id));
    this.addedDatasets.next(added.concat(filtered));
    this.datasetsToAdd = [];
  }

  removeSelectedDatasets(): void {
    const added = this.addedDatasets.value;
    // Filter anything that needs to be removed
    const filtered = added.filter(ds => !this.datasetsToRemove.find(data => ds._id === data._id));
    this.addedDatasets.next(filtered);
    this.datasetsToRemove = [];
  }

  navigateIntoDataset(ds: Dataset): void {
    if (ds._modelType !== 'folder') {
      return;
    }

    this.selectedDataset = ds;
    this.setCurrentRoot(this.selectedDataset._id);
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
    } else if (this.selectedDataset) {
      if (this.selectedDataset._modelType !== 'folder') {
        this.logger.error("ERROR: Can only navigate into datasets that are folders");

        return;
      }

      // Load folder with id=dataset._id
      this.currentFolderId = this.selectedDataset._id;

      // Fetch folders in the workspace
      this.folderService.folderFind({ parentId: this.currentFolderId, parentType: ParentType.Folder })
                        .pipe(enterZone(this.zone))
                        .subscribe(folders => {
                          this.folders.next(folders);
                        });

      // Fetch items in the workspace
      this.itemService.itemFind({ folderId: this.currentFolderId })
                      .pipe(enterZone(this.zone))
                      .subscribe(items => {
                        this.files.next(items);
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
    }
  }

  toggledCheckbox(e: any, sel: Selectable, selection: Array<Selectable>): void {
    // Debounce single-click handler
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        const index = selection.indexOf(sel);
        if (index === -1) {
          selection.push(sel);
        } else {
          selection.splice(index, 1);
        }
      }
    }, 250);
  }

  isSelected(target: Selectable, selection: Array<Selectable>): Boolean {
    return !!selection.find(elem => elem._id === target._id);
  }

  trackById(index: number, dataset: any): string {
    return dataset._id;
  }

  isNavActive(nav: string): boolean {
    return this.selectedNav === nav;
  }

  activateNav(nav: string): void {
    this.zone.run(() => {
      this.selectedNav = nav;
      this.datasets = (this.selectedNav === 'mine') ? this.myDatasets : this.allDatasets;
    });
  }

  navigateUp(): void {
    if (this.currentFolderId === this.selectedDataset._id) {
      // All the way up - show Dataset list
      this.currentRoot = undefined;
      this.selectedDataset = undefined;
      this.currentFolderId = undefined;
      this.canNavigateUp = false;
    } else {
      this.currentFolderId = this.currentRoot ? this.currentRoot.parentId : undefined;
      this.setCurrentRoot(this.currentFolderId);
    }

    this.load();
  }

  navigateToFolder(elem: FileElement): void {
    if (elem._modelType !== 'folder') {
      return;
    }
    this.setCurrentRoot(elem._id);
    this.currentFolderId = elem._id;
    this.load();
  }
}
