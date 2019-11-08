import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
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
export class TaleRunButtonComponent {
  @Input() instance: Instance;
  @Input() tale: Tale;

  @Input() isPrimary = false;

  interval: any;

  @Output() readonly taleInstanceStateChanged = new EventEmitter<Tale>();

  constructor(
    private readonly zone: NgZone,
    private readonly dialog: MatDialog,
    private readonly logger: LogService,
    private readonly taleService: TaleService,
    private readonly instanceService: InstanceService
  ) {}

  startTale(): void {
    if (this.tale._accessLevel < 2) {
      this.openCopyOnLaunchModal();

      return;
    }

    const stopPolling = () => {
      clearInterval(this.interval);
      this.interval = undefined;
    };

    const params = { taleId: this.tale._id };
    this.instanceService.instanceCreateInstance(params).subscribe(
      (instance: Instance) => {
        this.zone.run(() => {
          this.logger.debug('Starting tale:', this.tale._id);
          this.instance = instance;
          this.taleInstanceStateChanged.emit(this.tale);
          // this.refilter();

          // Poll / wait for launch
          // TODO: Fix edge cases (refresh, etc)
          this.zone.runOutsideAngular(() => {
            if (this.interval) {
              stopPolling();
            }

            this.interval = setInterval(() => {
              this.instanceService.instanceGetInstance(instance._id).subscribe(
                (watched: Instance) => {
                  this.logger.debug('Polling for instance status:', watched._id);
                  // this.refilter();
                  this.taleInstanceStateChanged.emit(this.tale);

                  // Once instance is running, stop the polling
                  if (watched.status === 1) {
                    this.zone.run(() => {
                      this.instance = watched;
                      stopPolling();
                    });
                  }
                },
                err => {
                  this.logger.error('Error polling for instance status:', err);

                  // Stop the polling if an error is hit
                  stopPolling();
                }
              );
            }, 2000);
          });
        });
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
    this.instanceService
      .instanceDeleteInstance(instance._id)
      .pipe(enterZone(this.zone))
      .subscribe(
        (deleted: Instance) => {
          this.logger.debug('Instance deleted:', deleted);
          // this.zone.run(() => {
          this.instance = undefined;
          this.taleInstanceStateChanged.emit(this.tale);
          // });
        },
        err => {
          this.logger.error('Failed to delete instance:', err);
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
