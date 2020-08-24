import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from '@shared/error-handler/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private readonly dialog: MatDialog) {}

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No Internet Connection';
    }

    return error.message ? error.message : error.toString();
  }

  getClientStack(error: Error): string {
    return error.stack;
  }

  getServerMessage(error: HttpErrorResponse): string {
    return error.message;
  }

  getServerStack(error: HttpErrorResponse): string {
    // TODO: handle stack trace
    return 'stack';
  }

  showErrorModal(title: string, error: any): MatDialogRef<any, any> {
    return this.dialog.open(ErrorModalComponent, { data: { error, title } });
  }
}
