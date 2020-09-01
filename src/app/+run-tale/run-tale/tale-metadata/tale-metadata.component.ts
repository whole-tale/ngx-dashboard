import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { Image } from '@api/models/image';
import { License } from '@api/models/license';
import { Tale } from '@api/models/tale';
import { PublishInfo } from '@api/models/publish-info';
import { User } from '@api/models/user';
import { ImageService } from '@api/services/image.service';
import { LicenseService } from '@api/services/license.service';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { NotificationService } from '@shared/error-handler/services/notification.service';
import { ErrorService } from '@shared/error-handler/services/error.service';
import { TaleAuthor } from '@tales/models/tale-author';
import { Observable } from 'rxjs';


// import * as $ from 'jquery';
declare var $: any;

interface TaleAuthorValidationError {
  index: number;
  message: string;
}

@Component({
  selector: 'app-tale-metadata',
  templateUrl: './tale-metadata.component.html',
  styleUrls: ['./tale-metadata.component.scss']
})
export class TaleMetadataComponent implements OnInit {
  @Input() tale: Tale;
  @Input() creator: User;

  licenses: Observable<Array<License>>;
  environments: Observable<Array<Image>>;

  apiRoot: string;

  // Edit mode
  editing: Boolean = false;
  _previousState: Tale;

  get canEdit(): boolean {
    if (!this.tale) {
      return false;
    }
    return this.tale._accessLevel >= 2;
  }

  get latestPublish(): PublishInfo {
    if (!this.tale || !this.tale.publishInfo || !this.tale.publishInfo.length) {
      return undefined;
    }

    // Sort by date, then
    return this.tale.publishInfo.sort((a: PublishInfo, b: PublishInfo) => {
      // Example Format: "2019-01-23T15:48:17.476000+00:0"
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);
      if (dateA > dateB) { return 1; }
      if (dateA < dateB) { return -1; }
      return 0;
    }).slice(-1).pop();
  }

  constructor(private ref: ChangeDetectorRef,
              private zone: NgZone,
              private config: ApiConfiguration,
              private logger: LogService,
              private taleService: TaleService,
              private licenseService: LicenseService,
              private notificationService: NotificationService,
              private errorHandler: ErrorService,
              private imageService: ImageService) {
    this.apiRoot = this.config.rootUrl;
  }

  ngOnInit(): void {
    const params = {};
    this.environments = this.imageService.imageListImages(params);
    this.licenses = this.licenseService.licenseGetLicenses();
    setTimeout(() => {
      $('#environmentDropdown:parent').dropdown().css('width', '100%');
      $('#licenseDropdown:parent').dropdown().css('width', '100%');
      this.saveState();
    }, 800);
  }

  canDeactivate(): boolean {
    // TODO: Revert to last known _previousState
    // TODO: Ask for confirmation, if yes then
    this.tale = this.copy(this._previousState);
    // and then
    return true;
  }

  startEdit(): void {
    // Save a backup of the Tale's state in memory
    this.saveState();
    this.editing = true;
  }

  saveEdit(): void {
    // Overwrite our backup of the Tale's state in memory with a new one
    this.editing = false;
    this.saveState();

    // Update the Tale in Girder
    this.updateTale();
  }

  cancelEdit(): void {
    // Revert to our backup of the Tale's state in memory
    this.editing = false;
    this.revertState();
  }

  saveState(): void {
    this._previousState = this.copy(this.tale);
  }

  revertState(): void {
    this.zone.run(() => {
      this.tale = this.copy(this._previousState);
    });
  }

  copy(obj: any): Tale {
    return JSON.parse(JSON.stringify(obj));
  }

  trackBySpdx(index: number, license: License): string {
    return license.spdx;
  }

  trackById(index: number, model: any): string {
    return model._id || model.orcid || model.itemId || model.identifier;
  }

  trackByAuthorHash(index: number, author: TaleAuthor): number {
    return index;
  }

  transformIdentifier(identifier: string) {
    if (identifier.indexOf('doi:') === 0) {
      return identifier.replace('doi:', 'doi.org/');
    }
    return identifier;
  }

  updateTale(): Promise<any> {
    const errors = this.validateAuthors();
    if (errors && errors.length > 0) {
      this.notificationService.showError('Failed to save: ' + errors[0].message);
      return new Promise(() => {});
    }

    const params = { id: this.tale._id , tale: this.tale };
    const promise = this.taleService.taleUpdateTale(params).toPromise()
    promise.then(res => {
      this.logger.debug("Successfully saved tale state:", this.tale);
      this.saveState();
      this.zone.run(() => {
        this.notificationService.showSuccess("Tale saved successfully");
      });
    }, err => {
      this.logger.error("Failed updating tale:", err);
    });
    return promise;
  }

  validateAuthors(): Array<TaleAuthorValidationError> {
    if (!this.tale.authors || !this.tale.authors.length) {
      return [];
    }

    const errors: Array<TaleAuthorValidationError> = [];
    this.tale.authors.forEach((author: TaleAuthor, index: number) => {
      if (!author.firstName) { errors.push({ index, message: 'Author\'s first name cannot be left blank.' }); }
      if (!author.lastName) { errors.push({ index, message: 'Author\'s last name cannot be left blank.' }); }
      if (!author.orcid) { errors.push({ index, message: 'Author\'s ORCID cannot be left blank.' }); }

      // TODO: Validate ORCID value (URL prefix, regex, etc)
      // NOTE: This only really matters during publishing
    });

    return errors;
  }

  addNewAuthor(): void {
    this.tale.authors.push({ firstName: '', lastName: '', orcid: '' });
  }

  removeAuthor(author: TaleAuthor): void {
    const index = this.tale.authors.indexOf(author);
    this.tale.authors.splice(index, 1);
  }

  generateIcon(): void {
    this.tale.illustration = 'http://lorempixel.com/400/400/abstract/';
  }
}
