import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customsnackbar',
  templateUrl: 'customsnackbar.component.html',
})
export class CustomSnackbarComponent {
  myContent: any;
  constructor(public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
