import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ErrorModalComponent } from './error-modal/error-modal.component';
import { GlobalErrorHandler } from './global-error.handler';
import { ServerErrorInterceptor } from './server-error.interceptor';

import { ErrorService } from './services/error.service';
import { LoggingService } from './services/logging.service';

@NgModule({
  declarations: [ErrorModalComponent],
  exports: [ErrorModalComponent],
  imports: [MatSnackBarModule, MatDialogModule],
  providers: [
    ErrorService,
    LoggingService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
  ],
  entryComponents: [ErrorModalComponent]
})
export class ErrorHandlerModule {}
