import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';
import { MatDialogModule } from '@angular/material/dialog';

import { TalesModule } from '@tales/tales.module';
import { TalesService } from '@tales/tales.service';

import { TaleCatalogComponent } from './tale-catalog/tale-catalog.component';
import { MyTalesComponent } from './tale-catalog/my-tales/my-tales.component';
import { PublicTalesComponent } from './tale-catalog/public-tales/public-tales.component';
import { TaleRunButtonComponent } from './tale-catalog/tale-run-button/tale-run-button.component';
import { CreateTaleModalComponent } from './tale-catalog/modals/create-tale-modal/create-tale-modal.component';
import { CopyOnLaunchModalComponent } from './tale-catalog/modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { DeleteTaleModalComponent } from './tale-catalog/modals/delete-tale-modal/delete-tale-modal.component';

import { routes } from './tale-catalog.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, MatDialogModule, TalesModule],
  providers: [TalesService],
  declarations: [TaleCatalogComponent, CreateTaleModalComponent, DeleteTaleModalComponent, CopyOnLaunchModalComponent, MyTalesComponent, PublicTalesComponent, TaleRunButtonComponent],
  entryComponents: [CreateTaleModalComponent, DeleteTaleModalComponent, CopyOnLaunchModalComponent],
})
export class TaleCatalogModule {}
