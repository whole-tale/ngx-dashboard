import { AuthGuard } from '@ngx-auth/core';

import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';

export const routes = [
  {
    path: '',
    component: TaleCatalogComponent,
    // canActivate: [AuthGuard],
    data: {
        meta: {
            title: 'PUBLIC.HOME.PAGE_TITLE',
            override: true,
            description: 'PUBLIC.HOME.META_DESCRIPTION'
        }
    }
  }
];
