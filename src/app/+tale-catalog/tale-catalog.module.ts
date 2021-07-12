import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';
import { SharedModule } from '@shared/shared.module';
import { TalesModule } from '@tales/tales.module';

import { routes } from './tale-catalog.routes';
import { MyTalesComponent } from './tale-catalog/components/my-tales/my-tales.component';
import { PublicTalesComponent } from './tale-catalog/components/public-tales/public-tales.component';
import { RunningTalesComponent } from './tale-catalog/components/running-tales/running-tales.component';
import { SharedTalesComponent } from './tale-catalog/components/shared-tales/shared-tales.component';
import { CreateTaleModalComponent } from './tale-catalog/modals/create-tale-modal/create-tale-modal.component';
import { DeleteTaleModalComponent } from './tale-catalog/modals/delete-tale-modal/delete-tale-modal.component';
import { MyTalesPipe } from './tale-catalog/pipes/my-tales.pipe';
import { PublicTalesPipe } from './tale-catalog/pipes/public-tales.pipe';
import { RunningTalesPipe } from './tale-catalog/pipes/running-tales.pipe';
import { SearchTalesPipe } from './tale-catalog/pipes/search-tales.pipe';
import { SharedTalesPipe } from './tale-catalog/pipes/shared-tales.pipe';
import { StoppedTalesPipe } from './tale-catalog/pipes/stopped-tales.pipe';
import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, TalesModule, SharedModule],
  declarations: [
    TaleCatalogComponent,
    CreateTaleModalComponent,
    DeleteTaleModalComponent,
    MyTalesComponent,
    PublicTalesComponent,
    PublicTalesPipe,
    MyTalesPipe,
    StoppedTalesPipe,
    RunningTalesComponent,
    RunningTalesPipe,
    SearchTalesPipe,
    SharedTalesComponent,
    SharedTalesPipe,
  ]
})
export class TaleCatalogModule {}
