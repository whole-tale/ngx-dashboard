import { Component } from '@angular/core';
import { Tale } from '@api/models/tale';
import { RepositoryService } from '@api/services/repository.service';
import { LogService }  from '@framework/core/log.service';
import { WindowService } from '@framework/core/window.service';

@Component({
  templateUrl: './register-data-dialog.component.html',
  styleUrls: ['./register-data-dialog.component.scss']
})
export class RegisterDataDialogComponent {
  selectedNav = 'web';

  registrationError = '';
  registrationUrl = '';

  showSearchResults = false;
  searchResultsLoading = false;
  searchResults: Array<any> = [];
  selectedResult: any;

  constructor(
    private logger: LogService,
    private repositoryService: RepositoryService,
    private window: WindowService
  ) {}

  dataONERepositoryBaseUrl(): string {
    return this.window.env.dataONEBaseUrl;
  }

  searchDatasetUrl(): void {
    if (!this.registrationUrl) { return; }

    this.searchResults = [];
    this.showSearchResults = true;
    this.searchResultsLoading = true;

    const dataId = [this.registrationUrl];
    const params = { dataId: JSON.stringify(dataId), baseUrl: this.dataONERepositoryBaseUrl() }
    this.repositoryService.repositoryLookupData(params).subscribe((values: Array<any>) => {
      this.searchResults = values;
      if (values.length > 0) {
        setTimeout(() => {
          this.selectedResult = values[0];
        }, 300);
      }
      this.searchResultsLoading = false;
    }, err => {
      this.logger.error(`Failed to search for dataId=${this.registrationUrl}:`, err);
      this.searchResultsLoading = false;
    });
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
