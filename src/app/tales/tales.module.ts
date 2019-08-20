import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { TalesService } from '@tales/tales.service';

import { CopyOnLaunchModalComponent } from './components/modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { TaleRunButtonComponent } from './components/tale-run-button/tale-run-button.component';

@NgModule({
  declarations: [CopyOnLaunchModalComponent, TaleRunButtonComponent],
  exports: [TaleRunButtonComponent, CopyOnLaunchModalComponent],
  providers: [TalesService],
  imports: [CommonModule, SharedModule, MaterialModule, MatDialogModule],
  entryComponents: [CopyOnLaunchModalComponent]
})
export class TalesModule {}
