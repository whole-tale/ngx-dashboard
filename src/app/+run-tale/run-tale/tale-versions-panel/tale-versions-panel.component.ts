import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiConfiguration } from '@api/api-configuration';
import { AccessLevel, Tale, Version } from '@api/models';
import { TaleService, VersionService } from '@api/services';
import { TokenService } from '@api/token.service';
import { LogService, WindowService } from '@shared/core';
import { NotificationService } from '@shared/error-handler/services/notification.service';
import { CollaboratorList } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';
import { SyncService } from '@tales/sync.service';
import { Subscription } from 'rxjs';

import { CreateRenameVersionDialogComponent } from '../modals/create-rename-version-dialog/create-rename-version-dialog.component';
import { TaleVersionInfoDialogComponent } from '../modals/tale-version-info-dialog/tale-version-info-dialog.component';

// import * as $ from 'jquery';
declare var $: any;

interface VersionUpdate {
  taleId: string;
  versionId: string;
}
@Component({
  selector: 'app-tale-versions-panel',
  templateUrl: './tale-versions-panel.component.html',
  styleUrls: ['./tale-versions-panel.component.scss']
})
export class TaleVersionsPanelComponent implements OnInit, OnChanges {
  @Input() tale: Tale;
  @Input() collaborators: CollaboratorList

  @Output() readonly taleVersionChanged = new EventEmitter<VersionUpdate>();

  versionsSubscription: Subscription;

  // Tale Version timeline (sorted list)
  timeline: Array<any> = [];
  AccessLevel = AccessLevel;

  constructor(private config: ApiConfiguration,
              private ref: ChangeDetectorRef,
              private zone: NgZone,
              private logger: LogService,
              private taleService: TaleService,
              private tokenService: TokenService,
              private versionService: VersionService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private windowService: WindowService,
              private syncService: SyncService) {
  }

  ngOnInit(): void {
    this.refresh();
    this.versionsSubscription = this.syncService.taleUpdatedSubject.subscribe((taleId) => {
      if (taleId === this.tale._id) {
        this.refresh();
      }
    });
  }

  ngOnChanges(): void {
    setTimeout(() => {
      $('.ui.version.dropdown').dropdown({ context: 'body', keepOnScreen: true});
    }, 500);
  }

  refresh(): void {
    this.versionService.versionListVersions({ taleId: this.tale._id }).subscribe((versions: Array<Version>) => {
      this.timeline = versions.sort(this.sortByUpdatedDate);
      this.ref.detectChanges();
    });
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
        force: result.force,
        allowRename: true
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
      data: { version, tale: this.tale, collaborators: this.collaborators }
    });
  }

  restoreVersion(version: Version): void {
    this.taleService.taleRestoreVersion(this.tale._id, version._id).subscribe(response => {
      this.logger.info("Tale version successfully restored");
      this.taleVersionChanged.emit(response);
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

  exportVersion(version: Version): void {
    const token = this.tokenService.getToken();
    const url = `${this.config.rootUrl}/tale/${this.tale._id}/export?token=${token}&taleFormat=bagit&versionId=${version._id}`;
    this.windowService.open(url, '_blank');
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
