import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AboutComponent } from '~/app/+about/about.component';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild([  {
    path: '',
    component: AboutComponent,
    data: {
      meta: {
        title: 'PUBLIC.ABOUT.PAGE_TITLE',
        description: 'PUBLIC.ABOUT.META_DESCRIPTION'
      }
    }
  }])],
  declarations: [
    AboutComponent,
  ],
})
export class AboutModule {}
