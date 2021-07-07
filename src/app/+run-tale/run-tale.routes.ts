import { RunTaleComponent } from './run-tale/run-tale.component';

export const routes = [
  {
    path: ':id',
    component: RunTaleComponent,
    data: {
      meta: {
        title: 'PUBLIC.RUN_TALE.PAGE_TITLE',
        description: 'PUBLIC.RUN_TALE.META_DESCRIPTION'
      }
    }
  }
];
