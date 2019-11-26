import { Component } from '@angular/core';
import { Tale } from '@api/models/tale';
import { RepositoryService } from '@api/services/repository.service';
import { LogService }  from '@framework/core/log.service';

@Component({
  templateUrl: './register-data-dialog.component.html',
  styleUrls: ['./register-data-dialog.component.scss']
})
export class RegisterDataDialogComponent {
  selectedNav = 'web';

  registrationError = '';
  registrationUrl = '';
  registrationFolderName = '';

  showSearchResults = false;
  searchResultsLoading = false;
  searchResults: any[] = [];
  selectedResult: any;

  // URL to the DataONE production server
  readonly repositoryBaseUrl = 'https://cn.dataone.org/cn/v2';

  constructor(private logger: LogService, private repositoryService: RepositoryService) {}

  searchDatasetUrl(): void {
    if (!this.registrationUrl) { return; }
    
    this.searchResults = [];
    this.showSearchResults = true;
    this.searchResultsLoading = true;

    const dataId = [this.registrationUrl];
    const params = { dataId: JSON.stringify(dataId), baseUrl: this.repositoryBaseUrl }
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

  isNavActive(nav: string): boolean {
    return this.selectedNav === nav;
  }

  activateNav(nav: string): void {
    this.selectedNav = nav;
  }
}
