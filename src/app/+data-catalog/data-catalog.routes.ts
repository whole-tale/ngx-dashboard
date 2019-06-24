import { AuthGuard } from '@ngx-auth/core';

import { DataCatalogComponent } from './data-catalog.component';

export const routes = [
  {
    path: '',
    component: DataCatalogComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'PUBLIC.ABOUT.ABOUT.PAGE_TITLE',
        description: 'PUBLIC.ABOUT.ABOUT.META_DESCRIPTION'
      }
    }
  }
];
