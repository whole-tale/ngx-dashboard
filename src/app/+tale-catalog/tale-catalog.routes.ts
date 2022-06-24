import { AuthGuard as CustomAuthGuard } from '@api/auth-guard';

import { MyTalesComponent } from './tale-catalog/components/my-tales/my-tales.component';
import { PublicTalesComponent } from './tale-catalog/components/public-tales/public-tales.component';
import { SharedTalesComponent } from './tale-catalog/components/shared-tales/shared-tales.component';
import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';

export const routes = [
  {
    path: '',
    component: TaleCatalogComponent,
    children: [
      {
          path: '',
          pathMatch: 'full',
          redirectTo: 'public'
      },
      {
        path: 'public',
        component: PublicTalesComponent,
        data: {
          meta: {
            title: 'PUBLIC.CATALOG.PUBLIC.PAGE_TITLE',
            description: 'PUBLIC.CATALOG.PUBLIC.META_DESCRIPTION'
          }
        },
      },
      {
        path: 'shared',
        component: SharedTalesComponent,
        canActivate: [CustomAuthGuard],
        data: {
          meta: {
            title: 'PUBLIC.CATALOG.SHARED.PAGE_TITLE',
            description: 'PUBLIC.CATALOG.SHARED.META_DESCRIPTION'
          }
        },
      },
      {
        path: 'mine',
        component: MyTalesComponent,
        canActivate: [CustomAuthGuard],
        data: {
          meta: {
            title: 'PUBLIC.CATALOG.MINE.PAGE_TITLE',
            description: 'PUBLIC.CATALOG.MINE.META_DESCRIPTION'
          }
        },
      },
    ]
  }
];
