import { Component, OnInit } from '@angular/core';
import { Dataset } from '@api/models/dataset';
import { DatasetService } from '@api/services/dataset.service';
import { RepositoryService } from '@api/services/repository.service';
import { LogService }  from '@framework/core/log.service';
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

  showSearchResults = false;
  searchResultsLoading = false;
  searchResults :any = [];
  selectedResult: any;

  // TODO: when to use prod URL?
  devUrl = 'https://dev.nceas.ucsb.edu/knb/d1/mn/v2';
  // URL to the DataONE production server
  prodUrl = 'https://cn.dataone.org/cn/v2';

  constructor(private logger: LogService, private datasetService: DatasetService, private repositoryService: RepositoryService) {}

  ngOnInit(): void {
    this.allDatasets = this.datasetService.datasetListDatasets({ myData: false });
    this.myDatasets = this.datasetService.datasetListDatasets({ myData: true });
  }

  searchDatasetUrl(): void {
    if (!this.registrationUrl) { return; }
    
    this.searchResults = [];
    this.showSearchResults = true;
    this.searchResultsLoading = true;

    const dataId = [this.registrationUrl];
    const params = { dataId: JSON.stringify(dataId), baseUrl: this.devUrl }
    this.repositoryService.repositoryLookupData(params).subscribe(data => {
      this.searchResults = data;
      this.searchResultsLoading = false;
    }, err => {
      this.logger.error(`Failed to search for dataId=${this.registrationUrl}:`, err);
      this.searchResultsLoading = false;
    });
  }

  onSelectedResultChanged(result: any): void {
    if (event) {
      this.registrationFolderName = result.name;
    }
  }

  trackByDataId(index: number, dataset: any): string {
      return dataset.dataId;
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
