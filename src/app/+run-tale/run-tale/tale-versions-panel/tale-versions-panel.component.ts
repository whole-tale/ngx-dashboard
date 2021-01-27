import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel } from '@api/models/access-level';
import { Tale } from '@api/models/tale';
import { Version } from '@api/models/version';
import { TaleService } from '@api/services/tale.service';
import { VersionService } from '@api/services/version.service';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { NotificationService } from '@shared/error-handler/services/notification.service';
import { TaleAuthor } from '@tales/models/tale-author';
import { Observable } from 'rxjs';

import { CreateRenameVersionDialogComponent } from '../modals/create-rename-version-dialog/create-rename-version-dialog.component';
import { TaleVersionInfoDialogComponent } from '../modals/tale-version-info-dialog/tale-version-info-dialog.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-tale-versions-panel',
  templateUrl: './tale-versions-panel.component.html',
  styleUrls: ['./tale-versions-panel.component.scss']
})
export class TaleVersionsPanelComponent implements OnInit, OnChanges {
  @Input() tale: Tale;

  // Tale Version timeline (sorted list)
  timeline: Array<any> = [];
  AccessLevel = AccessLevel;

  constructor(private ref: ChangeDetectorRef,
              private zone: NgZone,
              private logger: LogService,
              private taleService: TaleService,
              private versionService: VersionService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.versionService.versionListVersions({ taleId: this.tale._id }).subscribe((versions: Array<Version>) => {
      this.timeline = versions.sort(this.sortByUpdatedDate);
      this.ref.detectChanges();
    });
  }

  ngOnChanges(): void {
    setTimeout(() => {
      $('.ui.version.dropdown').dropdown({ context: 'body', keepOnScreen: true});
    }, 500);
  }

  /**
   * Compare two Version objects and return a number value that
   * represents the result of comparing their updated times:
   *   0 if the two version updated date/time are equal
   *   1 if the first version is after (greater than) the second
   *   -1 if the first version is before (less than) the second
   *
   * @param a First version to compare
   * @param b Second version to compare
   */
  sortByUpdatedDate(a: Version, b: Version): number {
    const dateA = new Date(a.updated);
    const dateB = new Date(b.updated);
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    } else {
      return 0;
    }
  }

  trackById(index: number, model: any): string {
    return model._id || model.orcid || model.itemId;
  }

  /** Global panel functions */
  saveNewVersion(): void {
    // Prompt for name (optional) / force?
    this.openCreateRenameModal("create", (result: { name: string, force?: boolean }) => {
      this.logger.debug('Creating New Tale version:', result);
      const params: VersionService.VersionCreateVersionParams = {
        taleId: this.tale._id,
        name: result.name,
        force: result.force
      };

      // Backend sets the name, if not provided
      this.versionService.versionCreateVersion(params).subscribe(version => {
        this.logger.info("Version saved successfully:", version);
        this.timeline.unshift(version);
        this.ref.detectChanges();

        this.zone.runOutsideAngular(() => setTimeout(() => {
          $('.ui.version.dropdown').dropdown({ context: 'body', keepOnScreen: true});
        }, 500));
      });
    });
  }

  openCreateRenameModal(mode = "create", after: Function): void {
      const config = { data: { taleId: this.tale._id, mode } };
      const dialogRef = this.dialog.open(CreateRenameVersionDialogComponent, config);
      dialogRef.afterClosed().subscribe((result: { name: string, force?: boolean }) => {
        if (!result) { return; }
        after(result);
      });
  }

  editRunConfigurations(): void {
    // TODO: What does this actually change? Design needed.
  }

  performRecordedRun(): void {
    // TODO: Restore from previous version
    // TODO: Execute autonomously
  }

  /** Per-version dropdown options */
  viewVersionInfo(version: Version): void {
    this.dialog.open(TaleVersionInfoDialogComponent, {
      data: { version, tale: this.tale }
    });
  }

  restoreVersion(version: Version): void {
    this.taleService.taleRestoreVersion(this.tale._id, version._id).subscribe(response => {
      this.logger.info("Tale version successfully restored");
      // TODO: here goes the code that updates tale related places
    });
    // TODO: Once they do this, how can the user get back to HEAD?
  }

  compareVersion(version: Version): void {
    // TODO: Show diff of this version with the current one
  }

  renameVersion(version: Version): void {
    this.openCreateRenameModal("rename", (result: { name: string, force?: boolean }) => {
      this.logger.debug('Renaming Tale version:', result);

      // Prompt for new name, disable "Save" if empty
      this.versionService.versionPutRenameVersion(version._id, result.name).subscribe(resp => {
        this.logger.info("Tale version successfully renamed:", result.name);
        const idx = this.timeline.indexOf(version);
        this.timeline[idx].name = result.name;
        this.ref.detectChanges();
      }, (err) => {
        this.logger.error("Failed renaming Tale version:", err);
        this.notificationService.showError("Error: something went wrong.");
      });
    });
  }

  deleteVersion(version: Version): void {
    // Delete the chosen version
    this.versionService.versionDeleteVersion(version._id).subscribe(response => {
      this.logger.info("Tale version successfully deleted:", version.name);
      const idx = this.timeline.indexOf(version);
      this.timeline.splice(idx, 1);
      this.ref.detectChanges();
    });
  }
}
