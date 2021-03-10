import { CommonModule as CommonAngularModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@framework/material';

import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { MenuGroupComponent } from './components/menu/menu-group.component';
import { MenuItemComponent } from './components/menu/menu-item.component';
import { TruncatePipe } from './pipes/truncate.pipe';

const COMPONENTS = [LoadingOverlayComponent, MenuGroupComponent, MenuItemComponent, ConfirmationModalComponent, AlertModalComponent];

@NgModule({
  imports: [CommonAngularModule, FormsModule, MaterialModule, MatDialogModule],
  declarations: [COMPONENTS, TruncatePipe],
  exports: [CommonAngularModule, COMPONENTS, TruncatePipe],
  entryComponents: [ConfirmationModalComponent, AlertModalComponent]
})
export class CommonModule {}
