import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from '@api/models';
import { BaseComponent } from '@shared/core';

@Component({
  templateUrl: './disconnect-account-modal.component.html',
  styleUrls: ['./disconnect-account-modal.component.scss'],
  selector: 'app-disconnect-account-modal'
})
export class DisconnectAccountModalComponent extends BaseComponent {
  selectedProvider: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { provider: Account }
  ) {
      super();
  }
}
