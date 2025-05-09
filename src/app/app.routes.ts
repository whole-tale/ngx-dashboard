import { AuthGuard as CustomAuthGuard } from '@api/auth-guard';

import { AboutComponent } from './+about/login.component';
import { MainComponent } from './layout/main.component';

export const routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'environments',
        loadChildren: () => import('./+compute-environments/compute-environments.module').then((m) => m.ComputeEnvironmentsModule),
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
        loadChildren: () => import('./+about/about.module').then((m) => m.AboutModule),
      },
      {
        path: '',
        loadChildren: () => import('./+tale-catalog/tale-catalog.module').then((m) => m.TaleCatalogModule),
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
