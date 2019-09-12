import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LogService } from '@framework/core/log.service';

import { ErrorModalComponent } from './error-modal/error-modal.component';
import { GlobalErrorHandler } from './global-error.handler';
import { ServerErrorInterceptor } from './server-error.interceptor';
import { ErrorService } from './services/error.service';

@NgModule({
  declarations: [ErrorModalComponent],
  exports: [ErrorModalComponent],
  imports: [MatSnackBarModule, MatDialogModule],
  providers: [
    ErrorService,
    LogService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
  ],
  entryComponents: [ErrorModalComponent]
})
export class ErrorHandlerModule {}
