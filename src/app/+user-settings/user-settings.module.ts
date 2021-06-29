import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';

import { ConfigureAccountsComponent } from './configure-accounts/configure-accounts.component';
import { ConnectApiKeyModalComponent } from './modals/connect-apikey-modal/connect-apikey-modal.component';
import { DisconnectAccountModalComponent } from './modals/disconnect-account-modal/disconnect-account-modal.component';
import { UserSettingsComponent } from './user-settings.component';
import { routes } from './user-settings.routes';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule.forChild(routes), MatDialogModule, MaterialModule],
  declarations: [
    UserSettingsComponent,
    ConfigureAccountsComponent,
    ConnectApiKeyModalComponent,
    DisconnectAccountModalComponent
  ]
})
export class UserSettingsModule { }
