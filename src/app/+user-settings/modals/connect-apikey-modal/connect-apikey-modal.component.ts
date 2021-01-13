import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from '@api/models/account';
import { User } from '@api/models/user';
import { AccountService } from '@api/services/account.service';
import { UserService } from '@api/services/user.service';
import { BaseComponent } from '@framework/core/base.component';
import { enterZone } from '@framework/ngrx/enter-zone.operator';

// import * as $ from 'jquery';
declare var $: any;

// TODO: Abstract/move enums to reuseable helper
enum KeyType {
    ApiKey = "apikey",
    DataONE = "dataone",
    Bearer = "Bearer"
};

interface UserToken {
  'access_token': string,
  'provider': string,   // NOTE: Globus tokens do not have a 'provider'
  'expires_in'?: number,
  'refresh_token'?: string,
  'resource_server': string,
  'scope'?: string,
  'state'?: string,
  'token_type': KeyType,
};

@Component({
  templateUrl: './connect-apikey-modal.component.html',
  styleUrls: ['./connect-apikey-modal.component.scss'],
  selector: 'app-connect-apikey-modal'
})
export class ConnectApiKeyModalComponent extends BaseComponent implements OnInit {
  newApiKey: UserToken;
  providerTargets: Array<string> = [];

  constructor(
    private readonly zone: NgZone,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { provider: Account }
  ) {
      super();
      this.newApiKey = {
        'provider': this.data.provider.name,
        'token_type': KeyType.ApiKey,
        'resource_server': '',
        'access_token': ''
      };
  }

  ngOnInit(): void {
      $('#newResourceServerDropdown').dropdown({ onChange: this.onTargetChange.bind(this) });
      this.accountService.accountListTargets({ provider: this.data.provider.name }).subscribe(targets => {
        this.providerTargets = targets;
      });
  }

  onTargetChange(value: any, text: string, $choice: any): void {
      this.newApiKey.resource_server = value;
  }

  trackByTarget(index: number, target: string): string {
      return target;
  }
}
