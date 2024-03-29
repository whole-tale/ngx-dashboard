import { CommonModule as CommonAngularModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewLogsDialogComponent } from '@shared/common/components/view-logs-dialog/view-logs-dialog.component';
import { MaterialModule } from '@shared/material';

import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { MenuGroupComponent } from './components/menu/menu-group.component';
import { MenuItemComponent } from './components/menu/menu-item.component';
import { SafePipe } from './pipes/safe.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

const COMPONENTS = [
  LoadingOverlayComponent,
  MenuGroupComponent,
  MenuItemComponent,
  ConfirmationModalComponent,
  AlertModalComponent,
  ViewLogsDialogComponent,
];

@NgModule({
  imports: [CommonAngularModule, FormsModule, MaterialModule, MatDialogModule],
  declarations: [COMPONENTS, SafePipe, TruncatePipe],
  exports: [CommonAngularModule, COMPONENTS, SafePipe, TruncatePipe],
})
export class CommonModule {}
