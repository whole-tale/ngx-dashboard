import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@shared/material';

import { ViewLogsDialogComponent } from './modals/view-logs-dialog/view-logs-dialog.component';
import { NotificationStreamComponent } from './notification-stream.component';
import { NotificationStreamService } from './notification-stream.service';

@NgModule({
  declarations: [NotificationStreamComponent, ViewLogsDialogComponent],
  exports: [NotificationStreamComponent],
  providers: [],
  imports: [CommonModule, MaterialModule, MatDialogModule]
})
export class NotificationStreamModule {}
