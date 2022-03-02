import { Component } from '@angular/core';
import { RepositoryService } from '@api/services';
import { LogService } from '@shared/core';

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
    private repositoryService: RepositoryService
  ) {}

  dataONERepositoryBaseUrl(): string {
    // tslint:disable-next-line:no-string-literal
    return window['env']['dataONEBaseUrl'];
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

  get docUrl(): string {
    // tslint:disable-next-line:no-string-literal
    return `${window['env']['rtdBaseUrl']}/users_guide/manage.html#supported-data-repositories`;
  }

  onSelectedResultChanged(event: any): void {
    this.logger.debug("Selected search result: ", event);

    return;
  }
}
