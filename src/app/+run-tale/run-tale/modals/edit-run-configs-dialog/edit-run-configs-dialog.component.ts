import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Tale } from '@api/models/tale';
import { LogService }  from '@shared/core';

// FIXME: Replace this with real models from Girder
export enum RunConfigType {
  Local, Container, Tapis
}
export interface TaleRunConfiguration {
  name: string;
  type: RunConfigType;
  mainEntrypoint: string;
  testsEnabled?: boolean;
  testEntrypoint?: string;
}
export class TaleRunConfiguration implements TaleRunConfiguration {
  name: string;
  type: RunConfigType;
  mainEntrypoint: string;
  testsEnabled? = false;
  testEntrypoint? = "";
}

@Component({
  templateUrl: './edit-run-configs-dialog.component.html',
  styleUrls: ['./edit-run-configs-dialog.component.scss']
})
export class EditRunConfigsDialogComponent {
  configs: Array<TaleRunConfiguration> = [];

  // FIXME: Add a real model?
  selectedConfig: TaleRunConfiguration;

  selectedConfigIsValid(): boolean {
    // Invalid if name or type are missing
    if (!this.selectedConfig.name) { return false; }

    // Invalid if no main entrypoint is specified
    if (!this.selectedConfig.mainEntrypoint) { return false; }

    // Invalid if tests are enabled and no test script specified
    if (this.selectedConfig.testsEnabled && !this.selectedConfig.testEntrypoint) { return false; }

    return true;
  }

  constructor(private logger: LogService,
              private ref: ChangeDetectorRef,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: { tale: Tale, config: TaleRunConfiguration }) {
    this.selectedConfig = data.config;
  }

  toggleTestsEnabled(): void {
    this.selectedConfig.testsEnabled = !this.selectedConfig.testsEnabled;
    this.ref.detectChanges();
  }
}
