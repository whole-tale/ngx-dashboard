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
    this.datasets.pipe(enterZone(this.zone)).subscribe(datasets => {
      this.data.tale.dataSet.forEach((ds: { itemId: string, mountPath: string, _modelType: string }) => {
        // Lookup the Dataset by id and push it to our selection
        const dataset = datasets.find((data: Dataset) => data._id === ds.itemId);
        if (dataset) {
          this.selected.push(dataset);
        } else {
          this.logger.error("Unknown tale.dataSet encountered... skipping:", ds);
        }
      });
    });
  }
  
  selectDataset(ds: Dataset): void {
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

  isSelected(target: Selectable): Selectable {
    return this.selected.find(elem => elem._id === target._id);
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
