import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@framework/core';
import { MaterialModule } from '@framework/material';
import { TalesModule } from '@tales/tales.module';
import { TalesService } from '@tales/tales.service';

import { routes } from './tale-catalog.routes';
import { MyTalesComponent } from './tale-catalog/components/my-tales/my-tales.component';
import { PublicTalesComponent } from './tale-catalog/components/public-tales/public-tales.component';
import { CreateTaleModalComponent } from './tale-catalog/modals/create-tale-modal/create-tale-modal.component';
import { DeleteTaleModalComponent } from './tale-catalog/modals/delete-tale-modal/delete-tale-modal.component';
import { MyTalesPipe } from './tale-catalog/pipes/my-tales.pipe';
import { PublicTalesPipe } from './tale-catalog/pipes/public-tales.pipe';
import { RunningTalesPipe } from './tale-catalog/pipes/running-tales.pipe';
import { StoppedTalesPipe } from './tale-catalog/pipes/stopped-tales.pipe';
import { SearchTalesPipe } from './tale-catalog/pipes/search-tales.pipe';
import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, MatDialogModule, TalesModule],
  providers: [TalesService],
  declarations: [
    TaleCatalogComponent,
    CreateTaleModalComponent,
    DeleteTaleModalComponent,
    MyTalesComponent,
    PublicTalesComponent,
    PublicTalesPipe,
    MyTalesPipe,
    StoppedTalesPipe,
    RunningTalesPipe,
    SearchTalesPipe
  ],
  entryComponents: [CreateTaleModalComponent, DeleteTaleModalComponent],
})
export class TaleCatalogModule {}
