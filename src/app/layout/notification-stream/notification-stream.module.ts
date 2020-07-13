import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@framework/core';
import { MaterialModule } from '@framework/material';
import { TalesService } from '@tales/tales.service';

import { NotificationStreamService } from './notification-stream.service';

import { ViewLogsDialogComponent } from './modals/view-logs-dialog/view-logs-dialog.component';
import { NotificationStreamComponent } from './notification-stream.component';

@NgModule({
  declarations: [NotificationStreamComponent, ViewLogsDialogComponent],
  exports: [NotificationStreamComponent],
  providers: [NotificationStreamService],
  imports: [CommonModule, SharedModule, MaterialModule, MatDialogModule],
  entryComponents: [ViewLogsDialogComponent]
})
export class NotificationStreamModule {}
