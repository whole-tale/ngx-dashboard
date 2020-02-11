import { AuthGuard } from '@ngx-auth/core';

import { UserSettingsComponent } from './user-settings.component';

export const routes = [
  {
    path: '',
    component: UserSettingsComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'PUBLIC.SETTINGS.PAGE_TITLE',
        description: 'PUBLIC.SETTINGS.META_DESCRIPTION'
      }
    }
  }
];
