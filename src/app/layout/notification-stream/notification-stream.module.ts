import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@shared/material';
import { SharedModule } from '@shared/shared.module';

import { NotificationStreamComponent } from './notification-stream.component';
import { NotificationStreamService } from './notification-stream.service';

@NgModule({
  declarations: [NotificationStreamComponent],
  exports: [NotificationStreamComponent],
  providers: [NotificationStreamService],
  imports: [CommonModule, MaterialModule, MatDialogModule, SharedModule],
})
export class NotificationStreamModule {}
