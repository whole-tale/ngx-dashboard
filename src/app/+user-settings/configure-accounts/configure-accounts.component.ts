import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Account } from '@api/models/account';
import { Repository } from '@api/models/repository';
import { User } from '@api/models/user';
import { AccountService } from '@api/services/account.service';
import { UserService } from '@api/services/user.service';
import { BaseComponent } from '@framework/core/base.component';
import { LogService } from '@framework/core/log.service';

import { ConnectApiKeyModalComponent } from '../modals/connect-apikey-modal/connect-apikey-modal.component';
import { DisconnectAccountModalComponent } from '../modals/disconnect-account-modal/disconnect-account-modal.component';

// TODO: Abstract/move enums to reuseable helper
enum KeyType {
    ApiKey = "apikey",
    DataONE = "dataone",
    Bearer = "Bearer"
};

interface UserToken {
  'access_token': string,
  'provider'?: string,   // NOTE: Globus tokens do not have a 'provider'
  'expires_in'?: number,
  'refresh_token'?: string,
  'resource_server': string,
  'scope'?: string,
  'state'?: string,
  'token_type': KeyType,
};

@Component({
  templateUrl: './configure-accounts.component.html',
  styleUrls: ['./configure-accounts.component.scss'],
  selector: 'app-configure-accounts',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureAccountsComponent extends BaseComponent implements OnInit {
  tokens: Array<UserToken> = [];
  providers: Array<Account> = [];
  
  constructor(
    private readonly ref: ChangeDetectorRef,
    private zone: NgZone,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly logger: LogService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
      super();
  }
  
  ngOnInit(): void {
    this.refreshProviders();
  }

  trackByName(index: number, provider: Account): string {
      return provider.name;
  }

  trackByProviderName(index: number, token: any): string {
    if (!token.provider) {
      return token;
    } 
    
    return token.provider.name;
  }
  
  refreshTokens(): void {
    this.userService.userGetMe().subscribe((user: User) => {
      if (!user || !user.otherTokens) {
        this.logger.error("Failed to fetch user:", user);
        
        return;
      }
      
      const tokens = user.otherTokens;
      this.tokens = tokens;
      
      this.logger.info('Fetched user tokens:', tokens);
      
      this.providers.forEach(provider => {
        if (provider.type === 'dataone' && provider.state === 'preauthorized') {
          this.logger.info("Fetching DataONE JWT");
          this.fetchDataOneJwt(user, provider);
        }
      });
      
      this.ref.detectChanges();
    }, (err: any) => {
      console.error('Failed to fetch user:', err);
    });
  }
  
  refreshProviders(): void {
    const redirect = 'https://next.local.wholetale.org/settings';
    const params = { redirect };
    this.accountService.accountListAccounts(params).subscribe((accts: Array<Account>) => {
      this.providers = accts;
      this.refreshTokens();
      this.logger.info('Fetched external accounts:', accts);
    }, (err: any) => {
      console.error('Failed to fetch accounts:', err);
    });
  }
  
  rerouteToOAuthLogin(provider: Account): boolean {
    if (provider.type === 'apikey') {
      return false;
    }
    
    // TODO: For DataONE/OAuth, just redirect to their login
    window.location.href = provider.url;
    return true;
  }
  
  fetchDataOneJwt(user: User, provider: Account) {
    if (provider.type !== 'dataone') {
      // Only fetch JWT for DataONE provider(s)
      this.logger.error("Cannot fetch JWT for non-DataONE account providers.");
      return;
    }

    const httpOptions = {
      withCredentials: true,
      responseType: 'text' as 'json',
      headers: new HttpHeaders({
        'Content-Type':  'text/xml',
      })
    };
    
    this.http.get(provider.url, httpOptions).subscribe((resp: string) => {
      // If we get a response, POST it back to Girder as an API key
      const jwt = resp;
      this.logger.info("POSTing DataONE JWT:", resp);
      const token = user.otherTokens.find((t: UserToken) => t.provider && t.provider === provider.name);
      this.connectProvider(provider.name, token.resource_server, jwt, KeyType.DataONE);
    }, (err: any) => {
      console.error("Failed to fetch DataONE JWT:", err);
    });
  }
  
  openConnectApiKeyModal(provider: Account, event: Event): void {
    const dialogRef = this.dialog.open(ConnectApiKeyModalComponent);
    dialogRef.afterClosed().subscribe((selectedResult: UserToken) => {
      if (!selectedResult) { return; }
      
      // TODO: connect APIKey account
      this.connectProvider(selectedResult.provider, selectedResult.resource_server, selectedResult.access_token, selectedResult.token_type);
    });
  }
  
  openDisconnectAccountModal(provider: Account, token: UserToken, event: Event): void {
    const dialogRef = this.dialog.open(DisconnectAccountModalComponent);
    dialogRef.afterClosed().subscribe((selectedResult: any) => {
      if (!selectedResult) { return; }
      
      // TODO: disconnect account
      this.disconnectProvider(provider.name, token.resource_server);
    });
  }
  
  clearConnectExtAcctModal(): void {
    // this.newApiKey = '';
    // this.newResourceServer = '';
  }
  
  connectProvider(providerName: string, resourceServer: string, apiKey: string, keyType: KeyType = KeyType.ApiKey): void {
    const params = {
      'provider': providerName,
      'resource_server': resourceServer,
      'key': apiKey,
      'key_type': keyType
    };
    
    this.accountService.accountCreateApiKeyAccount(params).subscribe(resp => {
      this.logger.info("Successfully attached API key:", resp);
      this.refreshProviders();
    }, err => {
      console.error("Failed to attach API key:", err);
    });
    
    this.clearConnectExtAcctModal();
  }
  
  disconnectProvider(providerName: string, resourceServer: string): void {
    const params = {
      'provider': providerName,
      'resource_server': resourceServer,
    };
    
    this.accountService.accountRevokeAccount(params).subscribe(resp => {
      this.logger.info("Successfully revoked API key:", resp);
      this.refreshProviders();
    }, err => {
      console.error("Failed to revoke API key:", err);
    });
  }
}
