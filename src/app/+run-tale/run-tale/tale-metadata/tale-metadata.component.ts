import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiConfiguration } from '@api/api-configuration';
import { AccessLevel } from '@api/models/access-level';
import { Image } from '@api/models/image';
import { License } from '@api/models/license';
import { PublishInfo } from '@api/models/publish-info';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { ImageService } from '@api/services/image.service';
import { LicenseService } from '@api/services/license.service';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { ErrorService } from '@shared/error-handler/services/error.service';
import { NotificationService } from '@shared/error-handler/services/notification.service';
import { TaleAuthor } from '@tales/models/tale-author';
import { SyncService } from '@tales/sync.service';
import { Observable } from 'rxjs';

import { ConfirmationModalComponent } from '@shared/common/components/confirmation-modal/confirmation-modal.component';

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

  confirmationModalShowing: boolean = false;
  apiRoot: string;

  // Edit mode
  editing: Boolean = false;
  _editState: Tale;

  get canEdit(): boolean {
    if (!this.tale) {
      return false;
    }

    return this.tale._accessLevel >= AccessLevel.Write;
  }

  // FIXME: Duplicated code (see publish-tale-dialog.component.ts)
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
              private imageService: ImageService,
              private syncService: SyncService,
              private dialog: MatDialog) {
    this.apiRoot = this.config.rootUrl;
  }

  ngOnInit(): void {
    const params = {};
    this.environments = this.imageService.imageListImages(params);
    this.licenses = this.licenseService.licenseGetLicenses();
    setTimeout(() => {
      $('#environmentDropdown:parent').dropdown().css('width', '100%');
      $('#licenseDropdown:parent').dropdown().css('width', '100%');
      this.revertState();
    }, 800);

    // Special handling for syncing data while editing
    this.syncService.taleUpdatedSubject.subscribe((taleId: string) => {
      if (taleId !== this.tale._id) {
        return;
      } else if (this.editing && !this.confirmationModalShowing) {
        this.confirmationModalShowing = true;

        // Prompt user that Tale state has changed, ask to refresh state
        const dialogRef = this.dialog.open(ConfirmationModalComponent, { data: {
            title: 'Tale was updated',
            content: [
              'This Tale was updated by another user.',
              'Would you like to refresh the Tale\'s data?',
              'Warning: Any unsaved changes will be lost.'
            ]
          }});
        dialogRef.afterClosed().subscribe((result: boolean) => {
          this.confirmationModalShowing = false;

          // EDGE CASE: Form fields won't update if they're focused - blur first
          const $focused = $(':focus');
          $focused.blur();

          if (result) {
            this.revertState();
          }
        });
      }
    });
  }

  canDeactivate(): boolean {
    // TODO: Revert to last known _editState
    // TODO: Ask for confirmation, if yes then
    if (this.editing) {
      this.revertState();
    }

    return true;
  }

  scrollToTop(): void {
    this.zone.runOutsideAngular(() => {
      // Edge case: Scroll to top of view
      document.querySelector('#scrollContainer').scrollTop = 0;
    });
  }

  startEdit(): void {
    // Save a backup of the Tale's state in memory
    this.revertState();
    this.editing = true;
  }

  saveEdit(): void {
    // Overwrite our backup of the Tale's state in memory with a new one
    this.editing = false;

    // Update the Tale in Girder, then in Angular
    this.updateTale().then((res) => {
      this.saveState();
      this.scrollToTop();
    });
  }

  cancelEdit(): void {
    // Revert to our backup of the Tale's state in memory
    this.editing = false;
    this.revertState();

    this.scrollToTop();
  }

  saveState(): void {
    this.tale = this.copy(this._editState);
  }

  revertState(): void {
    this._editState = this.copy(this.tale);
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

  transformIdentifier(identifier: string): string {
    if (identifier.indexOf('doi:') === 0) {
      return identifier.replace('doi:', 'https://doi.org/');
    }

    return identifier;
  }

  updateTale(): Promise<any> {
    const errors = this.validateAuthors();
    if (errors && errors.length > 0) {
      this.notificationService.showError(`Failed to save: ${errors[0].message}`);

      return new Promise(() => { this.logger.debug('Noop') });
    }

    const tale = this._editState;

    const params = { id: tale._id , tale };
    const promise = this.taleService.taleUpdateTale(params).toPromise()
    promise.then(res => {
      this.logger.debug("Successfully saved tale state:", tale);
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
    const tale = this._editState;
    if (!tale.authors || !tale.authors.length) {
      return [];
    }

    const errors: Array<TaleAuthorValidationError> = [];
    tale.authors.forEach((author: TaleAuthor, index: number) => {
      if (!author.firstName) { errors.push({ index, message: 'Author\'s first name cannot be left blank.' }); }
      if (!author.lastName) { errors.push({ index, message: 'Author\'s last name cannot be left blank.' }); }
      if (!author.orcid) { errors.push({ index, message: 'Author\'s ORCID cannot be left blank.' }); }

      // TODO: Validate ORCID value (URL prefix, regex, etc)
      // NOTE: This only really matters during publishing
    });

    return errors;
  }

  addNewAuthor(): void {
    this._editState.authors.push({ firstName: '', lastName: '', orcid: '' });
  }

  removeAuthor(author: TaleAuthor): void {
    const index = this.tale.authors.indexOf(author);
    this._editState.authors.splice(index, 1);
  }

  generateIcon(): void {
    this._editState.illustration = 'http://lorempixel.com/400/400/abstract/';
  }
}
