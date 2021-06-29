import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LogService } from '@shared/core';

import { ErrorModalComponent } from './error-modal/error-modal.component';
import { ErrorService } from './services/error.service';

@NgModule({
  declarations: [ErrorModalComponent],
  exports: [ErrorModalComponent],
  imports: [MatSnackBarModule, MatDialogModule],
  providers: [
    ErrorService,
    LogService
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
  ]
})
export class ErrorHandlerModule {}
