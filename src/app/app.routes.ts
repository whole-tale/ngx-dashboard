import { AuthGuard as CustomAuthGuard } from '@api/auth-guard';

import { MainComponent } from './layout/main.component';
import { LoginComponent } from './login/login.component';

export const routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./+tale-catalog/tale-catalog.module').then((m) => m.TaleCatalogModule),
      },
      {
        path: 'run',
        loadChildren: () => import('./+run-tale/run-tale.module').then((m) => m.RunTaleModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./+user-settings/user-settings.module').then((m) => m.UserSettingsModule),
        canActivateChild: [CustomAuthGuard],
      },
      {
        path: 'about',
        component: LoginComponent,
        data: {
          meta: {
            title: 'PUBLIC.LOGIN.PAGE_TITLE',
          },
        },
      },
    ],
    data: {
      i18n: {
        isRoot: true,
      },
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
