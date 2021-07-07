import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@shared/material';
import { SharedModule } from '~/app/shared';

import { CopyOnLaunchModalComponent } from './components/modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { TaleRunButtonComponent } from './components/tale-run-button/tale-run-button.component';
import { TaleCreatorPipe } from './pipes/tale-creator.pipe';
import { TaleImagePipe } from './pipes/tale-image.pipe';
import { TaleNamePipe } from './pipes/tale-name.pipe';

@NgModule({
  declarations: [CopyOnLaunchModalComponent, TaleRunButtonComponent, TaleCreatorPipe, TaleImagePipe, TaleNamePipe],
  exports: [TaleRunButtonComponent, CopyOnLaunchModalComponent, TaleCreatorPipe, TaleImagePipe, TaleNamePipe],
  providers: [TaleNamePipe],
  imports: [CommonModule, MaterialModule, MatDialogModule, SharedModule]
})
export class TalesModule {}
