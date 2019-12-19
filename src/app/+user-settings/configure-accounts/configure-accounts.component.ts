import { Component } from '@angular/core';
import { Account } from '@api/models/account';
import { Repository } from '@api/models/repository';
import { BaseComponent } from '@framework/core/base.component';

import { AccountService } from '@api/services/account.service';
import { RepositoryService } from '@api/services/repository.service';

@Component({
  templateUrl: './configure-accounts.component.html',
  styleUrls: ['./configure-accounts.component.scss'],
  selector: 'app-configure-accounts'
})
export class ConfigureAccountsComponent extends BaseComponent {
  repositories: Array<Repository> = [];
  providers: Array<Account> = [];
  
  constructor(
    private readonly accountService: AccountService,
    private readonly repositoryService: RepositoryService
  ) {
      super();
      
      this.repositoryService.repositoryListRepository().subscribe((repos: Array<Repository>) => {
        console.log('repos:', repos);
      }, (err: any) => {
        console.error('Failed to fetch repositories:', err);
      });
      
      const redirect = 'https://next.dashboard.wholetale.org/settings';
      const params = { redirect };
      this.accountService.accountListAccounts(params).subscribe((accts: Array<Account>) => {
        console.log('accounts:', accts);
      }, (err: any) => {
        console.error('Failed to fetch accounts:', err);
      });
  }
}
