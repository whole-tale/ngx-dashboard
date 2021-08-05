import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccessLevel, Instance, Tale } from '@api/models';
import { InstanceService, TaleService } from '@api/services';
import { LogService } from '@shared/core/log.service';
import { ErrorModalComponent } from '@shared/error-handler/error-modal/error-modal.component';
import { CopyOnLaunchModalComponent } from '@tales/components/modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { SyncService } from '@tales/sync.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tale-run-button',
  templateUrl: './tale-run-button.component.html',
  styleUrls: ['./tale-run-button.component.scss'],
})
export class TaleRunButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() instance: Instance;
  @Input() tale: Tale;

  @Input() isPrimary = false;

  interval: any;

  @Output() readonly taleInstanceStateChanged = new EventEmitter<{ tale: Tale; instance: Instance }>();

  instanceLaunchingSubscription: Subscription;
  instanceRunningSubscription: Subscription;
  instanceDeletingSubscription: Subscription;
  instanceDeletedSubscription: Subscription;
  instanceErrorSubscription: Subscription;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly taleService: TaleService,
    private readonly instanceService: InstanceService,
    private readonly syncService: SyncService
  ) {}

  ngOnInit(): void {
    this.instanceLaunchingSubscription = this.syncService.instanceLaunchingSubject.subscribe((resource) => {
      this.updateInstance(resource);
    });
    this.instanceRunningSubscription = this.syncService.instanceRunningSubject.subscribe((resource) => {
      this.updateInstance(resource);
    });
    this.instanceDeletingSubscription = this.syncService.instanceDeletingSubject.subscribe((resource) => {
      this.updateInstance(resource);
    });
    this.instanceDeletedSubscription = this.syncService.instanceDeletedSubject.subscribe((resource) => {
      this.updateInstance(resource);
    });
    this.instanceErrorSubscription = this.syncService.instanceErrorSubject.subscribe((resource) => {
      this.updateInstance(resource);
    });
  }

  ngOnChanges(): void {
    if (this.instance && (this.instance.status === 0 || this.instance.status === 3)) {
      // this.autoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.instanceLaunchingSubscription.unsubscribe();
    this.instanceRunningSubscription.unsubscribe();
    this.instanceDeletingSubscription.unsubscribe();
    this.instanceDeletedSubscription.unsubscribe();
    this.instanceErrorSubscription.unsubscribe();
  }

  updateInstance(resource: { taleId: string; instanceId: string }): void {
    // Ignore updates that aren't for this Tale
    if (resource.taleId !== this.tale._id) {
      return;
    }

    this.instanceService.instanceGetInstance(resource.instanceId).subscribe((instance: Instance) => {
      this.instance = instance;
      this.ref.detectChanges();
      this.taleInstanceStateChanged.emit(this);
    });
  }

  autoRefresh(): void {
    const stopPolling = () => {
      clearInterval(this.interval);
      this.interval = undefined;
      this.taleInstanceStateChanged.emit(this);
      this.ref.detectChanges();
    };

    // this.zone.runOutsideAngular(() => {
    if (this.interval) {
      stopPolling();
    }

    this.interval = setInterval(() => {
      if (!this.instance || !this.instance._id) {
        stopPolling();

        return;
      }

      this.instanceService.instanceGetInstance(this.instance._id).subscribe(
        (watched: Instance) => {
          this.logger.debug('Polling for instance status:', watched._id);
          // this.refilter();

          this.instance = watched;

          // Once instance is running, stop the polling
          if (watched.status === 1) {
            this.instance = watched;
            stopPolling();
          }
        },
        (err) => {
          if (err.error.message.startsWith('Invalid instance id')) {
            this.instance = undefined;
          } else {
            this.logger.error('Error polling for instance status:', err);
            this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
          }

          // Stop the polling if an error is hit
          stopPolling();
        }
      );
    }, 2000);
    // });
  }

  startTale(): void {
    if (this.tale._accessLevel <= AccessLevel.Read) {
      this.openCopyOnLaunchModal();

      return;
    }

    const params = { taleId: this.tale._id };
    this.instanceService.instanceCreateInstance(params).subscribe(
      (instance: Instance) => {
        this.logger.debug('Starting tale:', this.tale._id);
        this.instance = instance;
        this.taleInstanceStateChanged.emit(this);
        this.ref.detectChanges();
        this.router.navigate(['run', this.tale._id], { queryParams: { tab: 'interact' } });

        // Poll / wait for launch
        // TODO: Fix edge cases (refresh, etc)
        // this.autoRefresh();
      },
      (err: any) => {
        this.logger.error('Failed to create instance:', err);
        this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
      }
    );
  }

  stopTale(): void {
    const instance = this.instance;
    if (!instance) {
      this.logger.error('No instance found for taleId=', this.tale._id);

      return;
    }

    this.logger.debug('Stopping tale:', this.tale._id);

    // Show a fake "Deleting" message for a few seconds
    this.instance.status = 3;
    this.taleInstanceStateChanged.emit(this);
    this.ref.detectChanges();

    this.instanceService
      .instanceDeleteInstance(instance._id)
      // .pipe(enterZone(this.zone))
      .subscribe(
        (deleted: Instance) => {
          this.logger.debug('Instance deleted:', deleted);
          // this.zone.run(() => {

          // Clear the fake "Deleting" message
          this.autoRefresh();
          // });
        },
        (err) => {
          this.logger.error('Failed to delete instance:', err);
          this.autoRefresh();
        }
      );
  }

  openCopyOnLaunchModal(): void {
    const dialogRef = this.dialog.open(CopyOnLaunchModalComponent);
    dialogRef.afterClosed().subscribe((res: any) => {
      if (!res) {
        return;
      }

      this.taleService.taleCopyTale(this.tale._id).subscribe(
        (taleCopy: Tale) => {
          this.logger.debug('Successfully copied Tale... now launching!', taleCopy);
          // this.refresh();
          // this.startTale(taleCopy);
          // Update the display with the newly-created Tale copy
          this.taleInstanceStateChanged.emit({ tale: taleCopy, instance: undefined });

          // Navigate the UI to the new Tale copy
          this.router.navigate(['run', taleCopy._id]);
        },
        (err) => {
          this.logger.error('Failed to copy Tale:', err);
        }
      );
    });
  }
}
