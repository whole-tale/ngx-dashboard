import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorModalComponent } from './error-modal/error-modal.component';
import { ErrorService } from './services/error.service';
import { LoggingService } from './services/logging.service';
import { NotificationService } from './services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  constructor(private readonly injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const dialog = this.injector.get(MatDialog);
    const notifier = this.injector.get(NotificationService);

    let message;
    let stackTrace;

    if (error instanceof HttpErrorResponse) {
      // Server Error
      message = errorService.getServerMessage(error);
      stackTrace = errorService.getServerStack(error);
      /*let dialogRef = dialog.open(ErrorModalComponent, {
                width:'600px',
                data: { error }
            });*/
      notifier.showError(message);
    } else {
      // Client Error
      message = errorService.getClientMessage(error);
      stackTrace = errorService.getClientStack(error);
      /*let dialogRef = dialog.open(ErrorModalComponent, {
                width:'600px',
                data: { error }
            });*/
      notifier.showError(message);
    }

    // Always log errors
    logger.logError(message, stackTrace);

    console.error(error);
  }
}
