import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { DataCatalogComponent } from './data-catalog.component';
import { routes } from './data-catalog.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
  declarations: [DataCatalogComponent]
})
export class DataCatalogModule { }
