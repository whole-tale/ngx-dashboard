import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { InstanceService } from '@api/services/instance.service';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { ErrorModalComponent } from '@shared/error-modal/error-modal.component';
import { CopyOnLaunchModalComponent } from '@tales/components/modals/copy-on-launch-modal/copy-on-launch-modal.component';

@Component({
  selector: 'app-tale-run-button',
  templateUrl: './tale-run-button.component.html',
  styleUrls: ['./tale-run-button.component.scss']
})
export class TaleRunButtonComponent implements OnChanges {
  @Input() instance: Instance;
  @Input() tale: Tale;

  @Input() isPrimary = false;

  interval: any;

  @Output() readonly taleInstanceStateChanged = new EventEmitter<{ tale: Tale; instance: Instance }>();

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly taleService: TaleService,
    private readonly instanceService: InstanceService
  ) {}

  ngOnChanges(): void {
    if (this.instance && (this.instance.status === 0 || this.instance.status === 3)) {
      this.autoRefresh();
    }
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
        err => {
          if (err.error.message.startsWith('Invalid instance id')) {
            this.instance = undefined;
          } else {
            this.logger.error('Error polling for instance status:', err);
          }

          // Stop the polling if an error is hit
          stopPolling();
        }
      );
    }, 2000);
    // });
  }

  startTale(): void {
    if (this.tale._accessLevel < 2) {
      this.openCopyOnLaunchModal();

      return;
    }

    const params = { taleId: this.tale._id };
    this.instanceService.instanceCreateInstance(params).subscribe(
      (instance: Instance) => {
        // this.zone.run(() => {
        this.logger.debug('Starting tale:', this.tale._id);
        this.instance = instance;
        this.taleInstanceStateChanged.emit(this);
        this.ref.detectChanges();

        // Poll / wait for launch
        // TODO: Fix edge cases (refresh, etc)
        this.autoRefresh();
        // });
      },
      (err: any) => {
        this.logger.error('Failed to create instance:', err);
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
        err => {
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
        taleCopy => {
          this.logger.debug('Successfully copied Tale... now launching!', taleCopy);
          // this.refresh();
          // this.startTale(taleCopy);
          this.taleInstanceStateChanged.emit(taleCopy);
        },
        err => {
          this.logger.error('Failed to copy Tale:', err);
        }
      );
    });
  }
}
