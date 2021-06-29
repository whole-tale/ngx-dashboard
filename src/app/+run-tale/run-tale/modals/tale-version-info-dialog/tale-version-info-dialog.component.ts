import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale, Version } from '@api/models';

@Component({
  templateUrl: './tale-version-info-dialog.component.html',
  styleUrls: ['./tale-version-info-dialog.component.scss']
})
export class TaleVersionInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                tale: Tale, version: Version
              }) {}
}
