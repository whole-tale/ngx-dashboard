import { MyTalesComponent } from './tale-catalog/components/my-tales/my-tales.component';
import { PublicTalesComponent } from './tale-catalog/components/public-tales/public-tales.component';
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
        path: 'mine',
        component: MyTalesComponent,
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
