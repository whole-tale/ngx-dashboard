import { AuthGuard } from '@ngx-auth/core';

import { RunTaleComponent } from './run-tale/run-tale.component';
import { TaleInteractComponent } from './run-tale/tale-interact/tale-interact.component';
import { TaleMetadataComponent } from './run-tale/tale-metadata/tale-metadata.component';
import { TaleFilesComponent } from './run-tale/tale-files/tale-files.component';

export const routes = [
  /*{
    path: ':id',
    component: RunTaleComponent,
    // canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'PUBLIC.SECURE.PAGE_TITLE',
        description: 'PUBLIC.SECURE.META_DESCRIPTION'
      }
    }
  }*/
  {
    path: ':id',
    component: RunTaleComponent,
    children: [
      {
        path: 'interact',
        component: TaleInteractComponent,
        data: {
          meta: {
            title: 'PUBLIC.SECURE.PAGE_TITLE',
            description: 'PUBLIC.SECURE.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'files',
        component: TaleFilesComponent,
        data: {
          meta: {
            title: 'PUBLIC.SECURE.PAGE_TITLE',
            description: 'PUBLIC.SECURE.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'files/:folderid',
        component: TaleFilesComponent,
        data: {
          meta: {
            title: 'PUBLIC.SECURE.PAGE_TITLE',
            description: 'PUBLIC.SECURE.META_DESCRIPTION'
          }
        }
      },
      {
        path: 'metadata',
        component: TaleMetadataComponent,
        data: {
          meta: {
            title: 'PUBLIC.SECURE.PAGE_TITLE',
            description: 'PUBLIC.SECURE.META_DESCRIPTION'
          }
        }
      }
    ],
    canActivateChild: [AuthGuard],
    data: {
      i18n: {
        isRoot: true
      }
    }
  }
];
