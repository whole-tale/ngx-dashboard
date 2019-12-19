import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { ConfigureAccountsComponent } from './configure-accounts/configure-accounts.component';
import { UserSettingsComponent } from './user-settings.component';
import { routes } from './user-settings.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
  declarations: [UserSettingsComponent, ConfigureAccountsComponent]
})
export class UserSettingsModule { }
