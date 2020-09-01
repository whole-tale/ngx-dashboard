import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  constructor(public dialogRef: MatDialogRef<ErrorModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { error: any; title: string }) {}
}
