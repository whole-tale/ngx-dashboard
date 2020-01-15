import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from '@api/models/account';
import { Repository } from '@api/models/repository';
import { User } from '@api/models/user';
import { AccountService } from '@api/services/account.service';
import { UserService } from '@api/services/user.service';
import { BaseComponent } from '@framework/core/base.component';
import { enterZone } from '@framework/ngrx/enter-zone.operator';

@Component({
  templateUrl: './disconnect-account-modal.component.html',
  styleUrls: ['./disconnect-account-modal.component.scss'],
  selector: 'app-disconnect-account-modal'
})
export class DisconnectAccountModalComponent extends BaseComponent {
  selectedProvider: Account; 
  
  constructor(
    private readonly zone: NgZone,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { provider: Account }
  ) {
      super();
  }
}
