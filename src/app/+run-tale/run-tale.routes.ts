import { AuthGuard } from '@ngx-auth/core';

import { RunTaleComponent } from './run-tale.component';

export const routes = [
  {
    path: ':id',
    component: RunTaleComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'PUBLIC.SECURE.PAGE_TITLE',
        description: 'PUBLIC.SECURE.META_DESCRIPTION'
      }
    }
  }
];
