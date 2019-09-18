import { Component, OnInit } from '@angular/core';
import { Dataset } from '@api/models/dataset';
import { DatasetService } from '@api/services/dataset.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './select-data-dialog.component.html',
  styleUrls: ['./select-data-dialog.component.scss']
})
export class SelectDataDialogComponent implements OnInit {
  selectedNav = 'web';
  allDatasets: Observable<Array<Dataset>>;
  myDatasets: Observable<Array<Dataset>>;

  registrationError = '';
  registrationUrl = '';
  registrationFolderName = '';

  constructor(private datasetService: DatasetService) {}

  ngOnInit(): void {
    this.allDatasets = this.datasetService.datasetListDatasets({ myData: false });
    this.myDatasets = this.datasetService.datasetListDatasets({ myData: true });
  }

  searchDatasetUrl() {
    if (!this.registrationUrl) { return; }
    
    // TODO: search for dataset somehow?
  }

  trackById(index: number, dataset: Dataset): string {
      return dataset._id;
  }

  isNavActive(nav: string): boolean {
    return this.selectedNav === nav;
  }

  activateNav(nav: string): void {
    this.selectedNav = nav;
  }
}
