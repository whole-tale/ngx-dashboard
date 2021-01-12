import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale } from '@api/models/tale';
import { Version } from '@api/models/version';
import { LogService }  from '@framework/core/log.service';

@Component({
  templateUrl: './tale-version-info-dialog.component.html',
  styleUrls: ['./tale-version-info-dialog.component.scss']
})
export class TaleVersionInfoDialogComponent {
  constructor(private logger: LogService,
              @Inject(MAT_DIALOG_DATA) public data: {
                tale: Tale, version: Version
              }) {}
}
