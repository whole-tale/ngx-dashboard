// import { AuthGuard } from '@ngx-auth/core';

import { ComputeEnvironmentsComponent } from './compute-environments.component';

export const routes = [
  {
    path: '',
    component: ComputeEnvironmentsComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'COMPUTE_ENVIRONMENTS.PAGE_TITLE',
        description: 'COMPUTE_ENVIRONMENTS.META_DESCRIPTION'
      }
    }
  }
];
