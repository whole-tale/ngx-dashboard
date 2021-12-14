import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './single-input-modal.component.html',
  styleUrls: ['./single-input-modal.component.scss'],
})
export class SingleInputModalComponent {
  userInput: string;

  constructor(
    private readonly zone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; placeholder?: string; content?: string; default?: string }
  ) {
    if (this.data.default) {
      this.zone.run(() => {
        this.userInput = this.data.default;
      });
    }
  }
}
