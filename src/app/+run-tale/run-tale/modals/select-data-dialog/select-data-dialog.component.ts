import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dataset } from '@api/models/dataset';
import { Tale } from '@api/models/tale';
import { DatasetService } from '@api/services/dataset.service';
import { LogService }  from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './select-data-dialog.component.html',
  styleUrls: ['./select-data-dialog.component.scss']
})
export class SelectDataDialogComponent implements OnInit {
  selectedNav = 'mine';
  allDatasets: Observable<Array<Dataset>>;
  myDatasets: Observable<Array<Dataset>>;
  datasets: Observable<Array<Dataset>>;

  registrationError = '';
  registrationUrl = '';
  registrationFolderName = '';

  showSearchResults = false;
  searchResultsLoading = false;
  searchResults :any = [];
  selected: Array<Dataset> = [];

  constructor(
    private logger: LogService,
    private zone: NgZone,
    private datasetService: DatasetService, 
    public dialogRef: MatDialogRef<SelectDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tale: Tale }
  ) {}

  ngOnInit(): void {
    this.allDatasets = this.datasetService.datasetListDatasets({ myData: false });
    this.datasets = this.myDatasets = this.datasetService.datasetListDatasets({ myData: true });
    this.datasets.pipe(enterZone(this.zone)).subscribe(datasets => {
      this.data.tale.dataSet.forEach((ds: { itemId: string, mountPath: string }) => {
        // Lookup the Dataset by id and push it to our selection
        const dataset = datasets.find((data: Dataset) => data._id === ds.itemId);
        this.selected.push(dataset);
      });
    });
  }

  toggledCheckbox(e: any, dataset: Dataset): void {
    if (e.target.checked) {
      this.selected.push(dataset);
    } else {
      const index = this.selected.indexOf(dataset);
      this.selected.splice(index, 1);
    }
  }

  isSelected(dataset: Dataset): Dataset {
    return this.selected.find(ds => ds._id === dataset._id);
  }

  trackById(index: number, dataset: Dataset): string {
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
}
