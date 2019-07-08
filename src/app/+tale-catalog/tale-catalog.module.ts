import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { TalesModule } from '@tales/tales.module';
import { TalesService } from '@tales/tales.service';

import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';
import { routes } from './tale-catalog.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, TalesModule],
  providers: [TalesService],
  declarations: [TaleCatalogComponent]
})
export class TaleCatalogModule {}
