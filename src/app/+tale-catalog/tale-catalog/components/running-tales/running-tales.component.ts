import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Instance, Tale, User } from '@api/models';
import { TaleService } from '@api/services/tale.service';
import { ConfirmationModalComponent } from '@shared/common/components/confirmation-modal/confirmation-modal.component';
import { LogService } from '@shared/core';
import { TaleAuthor } from '@tales/models/tale-author';
import {
  DeleteTaleModalComponent
} from '~/app/+tale-catalog/tale-catalog/modals/delete-tale-modal/delete-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './running-tales.component.html',
  styleUrls: ['./running-tales.component.scss'],
  selector: 'app-running-tales'
})
export class RunningTalesComponent {

  @Input() taleList: Array<Tale>;

  @Input() instances: Map<string, Instance>; // = new Map<string, Instance> ();

  @Output()
  readonly taleDeleted: EventEmitter<Tale> = new EventEmitter<Tale>();

  @Input() creators: Map<string, User>; // = new Map<string, User> ();

  truncateLength = 100;

  constructor(
    private readonly zone: NgZone,
    private readonly ref: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly logger: LogService,
    private readonly taleService: TaleService
  ) {  }

  get instanceCount(): number {
    return Object.keys(this.instances).length;
  }

  trackByAuthorOrcid(index: number, author: TaleAuthor): string {
    return author.orcid;
  }

  trackById(index: number, tale: Tale): string {
    return tale._id;
  }

  showDimmer(tale: Tale): void {
    this.zone.runOutsideAngular(() => {
      $(`#${tale._id}-dimmer`).dimmer('show');
    });
  }

  hideDimmer(tale: Tale): void {
    this.zone.runOutsideAngular(() => {
      $(`#${tale._id}-dimmer`).dimmer('hide');
    });
  }

  openDeleteTaleModal(tale: Tale): void {
    const dialogRef = this.dialog.open(DeleteTaleModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return; }

      const id = tale._id;
      this.taleService.taleDeleteTale({ id }).subscribe(response => {
        this.logger.debug("Successfully deleted Tale:", response);
        this.taleDeleted.emit(tale);

        this.ref.detectChanges();
      }, (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.dialog.open(ConfirmationModalComponent, {
            data: {
              content: [
                'This Tale still has running instances.',
                'Deleting this Tale will terminate the running instances.',
                'This cannot be undone.',
                '',
                'Are you sure?'
              ]
            }
          }).afterClosed().subscribe(confirmResult => {
            if (confirmResult) {
              this.taleService.taleDeleteTale({ id, force: true }).subscribe(deleted => {
                this.taleDeleted.emit(tale);
              }, (confirmErr) => {
                this.logger.error("Failed to force deletion of Tale:", confirmErr);
              });
            }
          });
        } else {
          this.logger.error("Failed to delete Tale:", err);
        }
      });
    });
  }

  taleInstanceStateChanged($event: { tale: Tale; instance: Instance }): void {
    // this.refresh();
  }
}
