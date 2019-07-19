import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';
import { PublicTalesComponent } from './tale-catalog/components/public-tales/public-tales.component';
import { MyTalesComponent } from './tale-catalog/components/my-tales/my-tales.component';

export const routes = [
  {
    path: '',
    component: TaleCatalogComponent,
    children: [
      {
        path: '',
        component: PublicTalesComponent,
        data: {
          meta: {
            title: 'PUBLIC.SECURE.PAGE_TITLE',
            description: 'PUBLIC.SECURE.META_DESCRIPTION'
          }
        },
      },
      {
        path: 'mine',
        component: MyTalesComponent,
        data: {
          meta: {
            title: 'PUBLIC.SECURE.PAGE_TITLE',
            description: 'PUBLIC.SECURE.META_DESCRIPTION'
          }
        },
      },
    ]
  }
];
