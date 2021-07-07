import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { error: any; title: string }) {}
}
