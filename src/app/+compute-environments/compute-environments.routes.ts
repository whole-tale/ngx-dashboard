import { AuthGuard } from '@ngx-auth/core';

import { ComputeEnvironmentsComponent } from './compute-environments.component';

export const routes = [
  {
    path: '',
    component: ComputeEnvironmentsComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'PUBLIC.ABOUT.ABOUT.PAGE_TITLE',
        description: 'PUBLIC.ABOUT.ABOUT.META_DESCRIPTION'
      }
    }
  }
];
