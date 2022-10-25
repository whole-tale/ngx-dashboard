import { AfterViewInit, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image, Tale } from '@api/models';
import { ImageService, RepositoryService } from '@api/services';
import { LogService } from '@shared/core';

// import * as $ from 'jquery';
declare var $: any;

export enum Mode {
  Default = "default",
  Git = "git",
  DOI = "doi",
  AinWT = "ainwt",
}

@Component({
  templateUrl: './create-tale-modal.component.html',
  styleUrls: ['./create-tale-modal.component.scss']
})
export class CreateTaleModalComponent implements OnInit, AfterViewInit {
  newTale: Tale;
  datasetCitation: any;
  asTale = false;

  mode: Mode = Mode.Default;

  gitUrl = '';
  doiUrl = '';
  baseUrl = '';

  loading = false;
  found = false;
  isTale = false;
  error = false;

  environments: Array<Image> = [];

  constructor(
      private zone: NgZone,
      public dialogRef: MatDialogRef<CreateTaleModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { params: any, mode: string },
      private imageService: ImageService,
      private logger: LogService,
      private repositoryService: RepositoryService,
    ) {
    this.newTale = {
      title: (data && data.params) ? decodeURIComponent(data.params.name) : '',
      imageId: '',
      authors: [],
      licenseSPDX: 'CC-BY-4.0',
      category: 'science',
      publishInfo: [],
      dataSet: [],
      public: false,
      copyOfTale: undefined,
      description: '### Provide a description for your Tale'
    };
    this.mode = data.mode as Mode;
    this.baseUrl = (data && data.params && data.params.api) ? decodeURIComponent(data.params.api) : '';
    if (this.mode === Mode.Git) {
      this.gitUrl = (data && data.params && data.params.uri) ? decodeURIComponent(data.params.uri) : '';
    }

  }

  ngOnInit(): void {
    this.parseParameters();
  }

  ngAfterViewInit():void {
    $('.ui.checkbox').checkbox();
  }

  lookupDOI(evt: any): void {
    const doiUrl = evt.target.value;
    const dataId = [ doiUrl ];
    const params = { dataId: JSON.stringify(dataId), baseUrl: this.dataONERepositoryBaseUrl() }
    this.isTale = false;
    this.loading = true;
    this.error = false;
    this.repositoryService.repositoryLookupData(params).subscribe((values: Array<any>) => {
      if (values.length > 0) {
        setTimeout(() => {
          this.isTale = values[0].tale;
          this.newTale.title = values[0].name;
          this.loading = false;
          this.found = true;
          this.datasetCitation = { doi: values[0].doi };
        }, 300);
      }
    }, err => {
      this.logger.error(`Failed to find DOI/URL=${doiUrl}:`, err);
      this.error = true;
      this.reset();
    });
  }


  result(): { tale: Tale, asTale: boolean, url?: string, baseUrl?: string } {
    if (this.data.mode === Mode.Git) {
      return { tale: this.newTale, asTale: this.asTale, baseUrl: this.baseUrl, url: this.gitUrl };
    } else if (this.data.mode === Mode.DOI) {
      return { tale: this.newTale, asTale: this.asTale, baseUrl: this.baseUrl, url: this.doiUrl };
    } else {
      return { tale: this.newTale, asTale: this.asTale, baseUrl: this.baseUrl };
    }
  }

  dataONERepositoryBaseUrl(): string {
    return window.env.dataONEBaseUrl;
  }

  parseParameters(): void {
    // TODO: "Analyze in WT" case - Parse querystring to pre-populate dataSet/imageId/title
    this.zone.run(() => {
      $('.ui.dropdown').dropdown();
    });

    if (this.data && this.data.params && this.data.params.uri && this.mode === Mode.AinWT) {
      this.zone.run(() => {
        // TODO: Fetch / display data citation from datacite?
        this.datasetCitation = { doi: decodeURIComponent(this.data.params.uri) };
      });

      this.asTale = "true".indexOf(this.data.params.asTale?.toLowerCase()) !== -1;

      // Lookup dataset information
      const dataId = [this.data.params.uri];
      const params = { dataId: JSON.stringify(dataId), baseUrl: this.dataONERepositoryBaseUrl() }
      this.isTale = false;
      this.loading = true;
      this.error = false;
      this.repositoryService.repositoryLookupData(params).subscribe((values: Array<any>) => {
        if (values.length > 0) {
          setTimeout(() => {
            this.isTale = values[0].tale;
            this.newTale.title = values[0].name;
            this.loading = false;
            this.found = true;
          }, 300);
        }
      }, err => {
        this.logger.error(`Failed to find DOI/URL=${this.data.params.uri}:`, err);
        this.error = true;
        this.reset();
      });
    }


    // Fetch all Tale environment Images
    const listImagesParams = { limit: 0 };
    this.imageService.imageListImages(listImagesParams).subscribe(images => {
      this.zone.run(() => {
        this.environments = images;

        // If user specified an environment as a parameter, select it by default
        if (this.data && this.data.params && this.data.params.environment) {
          // Search for matching name
          const match = this.environments.find(env => env.name === decodeURIComponent(this.data.params.environment));
          if (match) {
            // If found, select it in the dropdown
            this.newTale.imageId = match._id;
          } else {
            this.logger.error(`Failed to find an environment named ${this.data.params.environment}`);
          }
        }
      });
    }, err => {
      this.logger.error("Failed to list images:", err);
    });
  }

  trackById(index: number, env: Image): string {
    return env._id;
  }

  reset(): void {
    this.newTale.title = '';
    this.newTale.imageId = '';
    this.loading = false;
    this.datasetCitation = {};
    this.isTale = false;
    this.asTale = false;
  }

  get docUrl(): string {
    return `${window.env.rtdBaseUrl}/users_guide/compose.html`;
  }

  get title(): string {
    let title = 'Create New Tale';
    if (this.isTale) {
      title = 'Import Tale';
    } else {
      switch(this.mode) {
        case Mode.Git:
          title = `${title} from Git`;
          break;
        case Mode.DOI:
          title = `${title} from DOI`;
          break;
        case Mode.Default:
        default:
          break;
      }
    }

    return title;
  }
}
