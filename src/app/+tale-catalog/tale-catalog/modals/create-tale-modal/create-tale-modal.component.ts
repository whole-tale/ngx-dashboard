import { AfterViewInit, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image, Tale } from '@api/models';
import { ImageService } from '@api/services';
import { LogService } from '@shared/core';
import { RepositoryService } from '@api/services';

// import * as $ from 'jquery';
declare var $: any;

enum Mode {
  Default = "default",
  Git = "git",
  DOI = "doi",
  AinWT = "ainwt",
};

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
    console.log(data.mode);
    this.mode = data.mode as Mode;
    console.log(this.mode);
    this.baseUrl = (data && data.params && data.params.api) ? decodeURIComponent(data.params.api) : '';
  }

  ngOnInit(): void {
    this.parseParameters();
  }

  ngAfterViewInit():void {
    $('.ui.checkbox').checkbox();
  }

  lookupDOI(evt: any): void {
    console.log(evt);
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
      this.loading = false;
      this.error = true;
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

    if (this.data && this.data.params && this.data.params.uri) {
      this.mode = Mode.AinWT;
      this.zone.run(() => {
        // TODO: Fetch / display data citation from datacite?
        this.datasetCitation = { doi: decodeURIComponent(this.data.params.uri) };
      });

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
        this.loading = false;
        this.error = true;
      });

      // Set read/write radio buttons using asTale value
      if (this.data.params.asTale) {
        setTimeout(() => {
          $('#readWriteRadio').click();
        }, 350);
      }
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

  enableReadOnly(evt: any): void {
    console.log("Enabling read only on this Tale...");
    const target = evt.target;
    if (target.checked) {
      this.asTale = false;
    }
  }

  enableReadWrite(evt: any): void {
    console.log("Enabling read/write on this Tale...");
    const target = evt.target;
    if (target.checked) {
      this.asTale = true;
    }
  }

  trackById(index: number, env: Image): string {
    return env._id;
  }

  get docUrl(): string {
    return `${window.env.rtdBaseUrl}/users_guide/compose.html`;
  }
}
