import { AuthGuard as CustomAuthGuard } from '@api/auth-guard';
import { AuthGuard } from '@ngx-auth/core';
import { MetaGuard } from '@ngx-meta/core';
import { ChangeLanguageComponent } from '~/app/framework/i18n';

import { MainComponent } from './layout/main.component';
import { LoginComponent } from './login/login.component';

export const routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'PUBLIC.LOGIN.PAGE_TITLE'
      }
    }
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./+tale-catalog/tale-catalog.module').then(m => m.TaleCatalogModule)
      },
      {
        path: 'environments',
        loadChildren: () => import('./+compute-environments/compute-environments.module').then(m => m.ComputeEnvironmentsModule)
      },
      {
        path: 'datasets',
        loadChildren: () => import('./+data-catalog/data-catalog.module').then(m => m.DataCatalogModule)
      },
      {
        path: 'run',
        loadChildren: () => import('./+run-tale/run-tale.module').then(m => m.RunTaleModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./+user-settings/user-settings.module').then(m => m.UserSettingsModule)
      }
    ],
    canActivateChild: [MetaGuard, CustomAuthGuard], // AuthGuard
    data: {
      i18n: {
        isRoot: true
      }
    }
  },
  {
    path: 'change-language/:languageCode',
    component: ChangeLanguageComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
