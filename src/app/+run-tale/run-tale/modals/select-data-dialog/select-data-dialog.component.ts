import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Collection, Dataset, Tale } from '@api/models';
import { CollectionService ,DatasetService, FolderService, ItemService } from '@api/services';
import { WholetaleService } from '@api/services/wholetale.service';
import { FileElement } from '@files/models/file-element';
import { enterZone, LogService } from '@shared/core';
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
  collections: Observable<Array<Collection>>;

  addedDatasets: BehaviorSubject<Array<Selectable>> = new BehaviorSubject<Array<Selectable>>([]);
  datasetsToAdd: Array<Selectable> = [];
  datasetsToRemove: Array<Selectable> = [];

  isSingleClick = false;
  enableDataCatalog = false;

  selectedDataset: Dataset;
  selectedCollection: Collection;
  currentRootId: string;
  currentRootType: ParentType;
  currentRoot: FileElement;
  canNavigateUp = false;
  folders: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);
  files: BehaviorSubject<Array<FileElement>> = new BehaviorSubject<Array<FileElement>>([]);

  selected: Array<Selectable> = [];

  constructor(
    private logger: LogService,
    private zone: NgZone,
    private collectionService: CollectionService,
    private datasetService: DatasetService,
    private folderService: FolderService,
    private itemService: ItemService,
    private readonly wholetaleService: WholetaleService,
    @Inject(MAT_DIALOG_DATA) public data: { tale: Tale, enableDataCatalog: boolean }
  ) {}

  ngOnInit(): void {
    this.allDatasets = this.datasetService.datasetListDatasets({ myData: false, limit: 0 });
    this.datasets = this.myDatasets = this.datasetService.datasetListDatasets({ myData: true, limit: 0 });
    this.collections = this.collectionService.collectionFind({ limit: 0 });
    const preAddedDatasets = this.data.tale.dataSet.map((ds: { itemId: string, mountPath: string, _modelType: string }) =>
      // Lookup the Dataset by id and push it to our selection
      ({ _modelType: ds._modelType, _id: ds.itemId, name: ds.mountPath }));
    this.enableDataCatalog = this.data.enableDataCatalog;
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

  navigateIntoCollection(collection: Collection): void {
    this.logger.debug("Navigating into collection", collection);
    this.selectedCollection = collection;
    this.setCurrentRoot(this.selectedCollection._id, 'collection');
    this.load();
  }

  load(): void {
    if (this.currentRootId) {
      this.logger.debug("Loading data for root", this.currentRootId);
        // Fetch folders in the given folder
      this.folderService.folderFind({ parentId: this.currentRootId, parentType: this.currentRootType, limit: 0 })
                        .pipe(enterZone(this.zone))
                        .subscribe((folders: Array<FileElement>) => {
                          this.folders.next(folders);
                        });
        // Fetch items in the given folder
      if (this.currentRootType === ParentType.Folder) {
        this.itemService.itemFind({ folderId: this.currentRootId, limit: 0 })
                        .pipe(enterZone(this.zone))
                        .subscribe((items: Array<FileElement>) => {
                        this.files.next(items);
                      });
      } else {
        this.files.next([]);
      }

      return;
    } else if (this.selectedDataset || this.selectedCollection) {
      this.logger.debug("Loading subdata for root", this.selectedDataset || this.selectedCollection);
      if (this.selectedDataset && this.selectedDataset._modelType !== 'folder') {
        this.logger.error("ERROR: Can only navigate into datasets that are folders");

        return;
      }

      // Load folder with id=dataset._id
      if (this.selectedDataset) {
        this.currentRootId = this.selectedDataset._id;
      } else if (this.selectedCollection) {
        this.currentRootId = this.selectedCollection._id;
      }

      // Fetch folders in the workspace
      this.folderService.folderFind({ parentId: this.currentRootId, parentType: this.currentRootType, limit: 0 })
                        .pipe(enterZone(this.zone))
                        .subscribe((folders: Array<FileElement>) => {
                          this.folders.next(folders);
                        });

      // Fetch items in the workspace
      if (this.currentRootType === ParentType.Folder) {
        this.itemService.itemFind({ folderId: this.currentRootId, limit: 0 })
                        .pipe(enterZone(this.zone))
                        .subscribe((items: Array<FileElement>) => {
                          this.files.next(items);
                        });
      }
    }
  }

  setCurrentRoot(resourceId: string, modelType = 'folder'): void {
    // Lookup and set our root node
    if (resourceId) {
      switch (modelType) {
        case 'folder':
          this.currentRootType = ParentType.Folder;
          this.folderService.folderGetFolder(resourceId)
                            .pipe(enterZone(this.zone))
                            .subscribe((folder: FileElement) => {
            this.currentRoot = folder;
            this.currentRootId = this.currentRoot._id;
            this.canNavigateUp = this.currentRoot ? true : false;
            this.logger.debug(`currentRoot is now: ${this.currentRoot.name}`);
          });
          break;
        case 'collection':
          this.currentRootType = ParentType.Collection;
          this.collectionService.collectionGetCollection(resourceId)
                                .pipe(enterZone(this.zone))
                                .subscribe((collection: FileElement) => {
            this.currentRoot = collection;
            this.currentRootId = this.currentRoot._id;
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
      this.currentRootId = undefined;
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
    if ((this.selectedDataset && this.currentRootId === this.selectedDataset._id) ||
        (this.selectedCollection && this.currentRootId === this.selectedCollection._id)) {
      // All the way up - show Dataset list
      this.currentRoot = undefined;
      this.selectedDataset = undefined;
      this.selectedCollection = undefined;
      this.currentRootId = undefined;
      this.canNavigateUp = false;
    } else {
      this.logger.debug("Navigating up from", this.currentRoot.name);
      this.logger.debug("to", this.currentRoot.parentId);
      this.logger.debug("which is", this.currentRoot.parentCollection);
      this.currentRootId = this.currentRoot ? this.currentRoot.parentId : undefined;
      this.setCurrentRoot(this.currentRootId, this.currentRoot.parentCollection);
    }

    this.load();
  }

  navigateToFolder(elem: FileElement): void {
    if (elem._modelType !== 'folder' && elem._modelType !== 'collection') {
      return;
    }
    this.setCurrentRoot(elem._id);
    this.currentRootId = elem._id;
    this.load();
  }

  skipSystemCollections(collections: Array<Collection>): Array<Collection> {
    return collections.filter(collection => !collection.name.startsWith("WholeTale"));
  }
}
