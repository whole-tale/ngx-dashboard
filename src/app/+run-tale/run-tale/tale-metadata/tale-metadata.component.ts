import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { Image } from '@api/models/image';
import { License } from '@api/models/license';
import { Tale } from '@api/models/tale';
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
  environment: Image;
  newAuthor: TaleAuthor;

  apiRoot: string;

  // Edit mode
  _previousState: Tale;
  editing = false;

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
    this.resetNewAuthor();
  }

  ngOnInit(): void {
    const params = {};
    this.environments = this.imageService.imageListImages(params);
    this.licenses = this.licenseService.licenseGetLicenses();
  }

  ngOnChanges(): void {
    this.editing = this.tale._accessLevel > 1;
    this.ref.detectChanges();
    if (this.editing) {
      setTimeout(() => {
        $('#environmentDropdown:parent').dropdown().css('width', '100%');
        $('#licenseDropdown:parent').dropdown().css('width', '100%');
      }, 500);
    }
  }

  trackById(index: number, model: any): string {
    return model._id || model.orcid || model.itemId;
  }

  // TODO: Abstract to generic helper method
  copy(json: any): any {
    return JSON.parse(JSON.stringify(json));
  }

  editTale(): void {
    this._previousState = this.copy(this.tale);
    this.editing = true;
    setTimeout(() => {
      $('#environmentDropdown:parent').dropdown().css('width', '100%');
      $('#licenseDropdown:parent').dropdown().css('width', '100%');
    }, 500);
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

  saveTaleEdit(): void {
    const params = { id: this.tale._id , tale: this.tale };
    this.updateTale().then(res => {
      this.editing = false;
    });
  }

  cancelTaleEdit(): void {
    this.tale = this.copy(this._previousState);
    this.editing = false;
  }

  addAuthor(author: TaleAuthor): void {
    this.tale.authors.push(author);
    this.resetNewAuthor();
  }

  addNewAuthor(): void {
    this.tale.authors.push({ firstName: '', lastName: '', orcid: '' });
    this.resetNewAuthor();
  }

  removeAuthor(author: TaleAuthor): void {
    const index = this.tale.authors.indexOf(author);
    this.tale.authors.splice(index, 1);
  }

  resetNewAuthor(): void {
    this.newAuthor = {
      firstName: '',
      lastName: '',
      orcid: ''
    };
  }
}
