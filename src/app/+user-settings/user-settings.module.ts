import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core'; 
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { ConfigureAccountsComponent } from './configure-accounts/configure-accounts.component';
import { ConnectApiKeyModalComponent } from './modals/connect-apikey-modal/connect-apikey-modal.component';
import { DisconnectAccountModalComponent } from './modals/disconnect-account-modal/disconnect-account-modal.component';
import { UserSettingsComponent } from './user-settings.component';
import { routes } from './user-settings.routes';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule.forChild(routes), SharedModule, MatDialogModule, MaterialModule],
  declarations: [
    UserSettingsComponent,
    ConfigureAccountsComponent,
    ConnectApiKeyModalComponent,
    DisconnectAccountModalComponent
  ],
  entryComponents: [ConnectApiKeyModalComponent, DisconnectAccountModalComponent],
})
export class UserSettingsModule { }
