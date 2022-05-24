import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Run } from '@api/models/run';
import { Tale } from '@api/models/tale';
import { Version } from '@api/models/version';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@shared/core';

@Component({
  templateUrl: './recorded-run-info-dialog.component.html',
  styleUrls: ['./recorded-run-info-dialog.component.scss']
})
export class RecordedRunInfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      tale: Tale, version: Version, run: Run
    }) {}
}
