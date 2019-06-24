import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { TaleCatalogComponent } from './tale-catalog.component';
import { routes } from './tale-catalog.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
  declarations: [TaleCatalogComponent]
})
export class TaleCatalogModule {}
