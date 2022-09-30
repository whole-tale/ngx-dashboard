import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiConfiguration } from '@api/api-configuration';
import { AccessLevel, Run, Tale, Version } from '@api/models';
import { RunService, TaleService, VersionService } from '@api/services';
import { TokenService } from '@api/token.service';
import { LogService } from '@shared/core';
import { ErrorModalComponent } from '@shared/error-handler/error-modal/error-modal.component';
import { NotificationService } from '@shared/error-handler/services/notification.service';
import { CollaboratorList } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';
import { SyncService } from '@tales/sync.service';
import { Observable, Subscription } from 'rxjs';
import { RecordedRunInfoDialogComponent } from '~/app/+run-tale/run-tale/modals/recorded-run-info-dialog/recorded-run-info-dialog.component';
import {
  MAIN_ENTRYPOINT_STORAGE_KEY,
  RunEntrypointDialogComponent
} from '~/app/+run-tale/run-tale/modals/run-entrypoint-dialog/run-entrypoint-dialog.component';

import { CreateRenameVersionDialogComponent } from '../modals/create-rename-version-dialog/create-rename-version-dialog.component';
// TODO: Use real models from Girder
import {
  EditRunConfigsDialogComponent,
  RunConfigType,
  TaleRunConfiguration
} from '../modals/edit-run-configs-dialog/edit-run-configs-dialog.component';
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
export class TaleVersionsPanelComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tale: Tale;
  @Input() collaborators: CollaboratorList

  @Output() readonly taleVersionChanged = new EventEmitter<VersionUpdate>();

  versionsSubscription: Subscription;

  runConfig: TaleRunConfiguration = { name: '', mainEntrypoint: '', testEntrypoint: '', testsEnabled: false, type: RunConfigType.Local};

  // Tale Version timeline (sorted list)
  timeline: Array<any> = [];
  AccessLevel = AccessLevel;

  get latestVersion(): Observable<Version> {
    return this.versionService.versionListVersions({ taleId: this.tale._id });
  }

  constructor(private config: ApiConfiguration,
              private ref: ChangeDetectorRef,
              private zone: NgZone,
              private logger: LogService,
              private taleService: TaleService,
              public tokenService: TokenService,
              private versionService: VersionService,
              private runService: RunService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private router: Router,
              private syncService: SyncService) {
  }

  ngOnInit(): void {
    this.versionsSubscription = this.syncService.taleUpdatedSubject.subscribe((taleId) => {
      if (taleId === this.tale._id) {
        this.refresh();
      }
    });
  }

  ngOnChanges(): void {
    this.refresh();
    setTimeout(() => {
      $('.ui.version.dropdown').dropdown({ context: 'body', keepOnScreen: true});
    }, 500);
  }

  ngOnDestroy(): void {
    this.versionsSubscription?.unsubscribe();
  }

  refresh(): void {
    this.versionService.versionListVersions({ taleId: this.tale._id }).subscribe((versions: Array<Version>) => {
      this.runService.runListRuns({ taleId: this.tale._id }).subscribe((runs: Array<Run>) => {
        this.timeline = versions.concat(runs).sort(this.sortByCreatedDate);
        this.ref.detectChanges();
      });
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
  sortByCreatedDate(a: Version, b: Version): number {
    const dateA = new Date(a.created);
    const dateB = new Date(b.created);
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

  editRunConfiguration(): void {
    const dialogRef = this.dialog.open(EditRunConfigsDialogComponent, {
      data: { tale: this.tale, config: this.runConfig }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      this.runConfig = result;
    });
  }

  createAndStartRecordedRun(version: Version, mainEntrypoint: string): void {
    // Update Tale to get "restoredFrom" (prevents 303 from POST /version)
    this.taleVersionChanged.emit();
    this.refresh();

    if (!version) {
      this.logger.error("Something went wrong.. no version found!");

      return;
    } else {
      this.runService.runCreateRun({ versionId: version._id }).subscribe((run: Run) => {
        this.logger.info("Run created: ", run);

        const params = { id: run._id, mainEntrypoint }
        this.runService.runStartRun(params).subscribe((started: Run) => {
          this.logger.info("Run started: ", started);
          this.refresh();
        }, err => {
          this.logger.error("Failed to start run: ", err);
          this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
        });
      }, err => {
        this.logger.error("Failed to create run: ", err);
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      });
    }
  }

  performRecordedRun(): void {
    this.logger.debug('Creating recorded run');

    // TODO: Validation?
    // FIXME: refactor this to abstract single-input-modal?
    const config = { data: { taleId: this.tale._id } };
    const dialogRef = this.dialog.open(RunEntrypointDialogComponent, config);
    dialogRef.afterClosed().subscribe((result: string) => {
      if (!result) {
        return this.logger.error("Attempted to submit recorded run without main entrypoint script name: ", result);
      }

      const mainEntrypoint = result;

      localStorage.setItem(MAIN_ENTRYPOINT_STORAGE_KEY, mainEntrypoint);
      const tale = this.tale;

      // Always attempt to save a new version
      this.versionService.versionCreateVersion({ taleId: tale._id }).subscribe((version: Version) => {
        this.createAndStartRecordedRun(version, mainEntrypoint);
      }, (createErr: HttpErrorResponse) => {
        this.logger.error("Failed to create version: ", createErr);

        if (createErr.error instanceof ErrorEvent) {
          // A client-side or network error occurred
          this.logger.error('An error occurred:', createErr.error.message);
          this.dialog.open(ErrorModalComponent, { data: { error: createErr.error } });
        } else if (createErr.status === 303) {
          const json = createErr.error;
          this.versionService.versionGetVersion(json.extra).subscribe((version: Version) => {
            this.createAndStartRecordedRun(version, mainEntrypoint);
          }, fetchErr => {
            this.logger.error("Failed to fetch version: ", fetchErr);
            this.dialog.open(ErrorModalComponent, { data: { error: createErr.error } });
          });
        }
      });
    });
  }
}
