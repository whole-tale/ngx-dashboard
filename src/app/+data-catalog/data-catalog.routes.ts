import { AuthGuard } from '@ngx-auth/core';

import { DataCatalogComponent } from './data-catalog.component';

export const routes = [
  {
    path: '',
    component: DataCatalogComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'DATA_CATALOG.PAGE_TITLE',
        description: 'DATA_CATALOG.META_DESCRIPTION'
      }
    }
  }
];
