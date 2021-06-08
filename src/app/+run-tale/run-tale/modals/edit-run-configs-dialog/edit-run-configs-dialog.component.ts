import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Tale } from '@api/models/tale';
import { LogService }  from '@framework/core/log.service';

import { ConfirmationModalComponent } from '@shared/common/components/confirmation-modal/confirmation-modal.component';

// FIXME: Replace this with real models from Girder
enum RunConfigType {
  Local, Container, Tapis
}
interface TaleRunConfiguration {
  name: string;
  type: RunConfigType;
  mainEntrypoint: string;
  testsEnabled?: boolean;
  testEntrypoint?: string;
}
class TaleRunConfiguration implements TaleRunConfiguration {
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
export class EditRunConfigsDialogComponent implements OnInit {
  configs: Array<TaleRunConfiguration> = [];

  // FIXME: Add a real model?
  selectedIndex: number;
  selectedConfig: TaleRunConfiguration;

  selectedConfigIsDirty(): boolean {
    const index = this.selectedIndex;
    if (index === undefined || index === null) {
      return false;
    }

    const oldConfig = this.configs[index];
    if (this.selectedConfig.name !== oldConfig.name) { return true; }
    if (this.selectedConfig.type !== oldConfig.type) { return true; }
    if (this.selectedConfig.mainEntrypoint !== oldConfig.mainEntrypoint) { return true; }
    if (this.selectedConfig.testsEnabled !== oldConfig.testsEnabled) { return true; }
    if (this.selectedConfig.testEntrypoint !== oldConfig.testEntrypoint) { return true; }

    return false;
  }
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
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    // FIXME: This is fake static data
    this.configs = [
      { name: "default", type: RunConfigType.Local, mainEntrypoint: "/Workspace/run.sh", testEntrypoint: "/Workspace/test.sh" },
      { name: "docker", type: RunConfigType.Container, mainEntrypoint: "/Workspace/run.sh", testEntrypoint: "/Workspace/test.sh" }
    ];
  }

  selectConfig(index: number): void {
    this.selectedIndex = index;
    this.selectedConfig = (index === undefined || index === null) ? undefined : this.copy(this.configs[index]);
  }

  toggleTestsEnabled(): void {
    this.selectedConfig.testsEnabled = !this.selectedConfig.testsEnabled;
    this.ref.detectChanges();
  }

  addNewConfig(configToAdd?: TaleRunConfiguration): void {
    if (configToAdd) {
      this.configs.push(configToAdd);
    } else {
      this.configs.push({ name: 'new', type: RunConfigType.Local, mainEntrypoint: '', testsEnabled: false, testEntrypoint: '' });
    }

    // Select newest (last) config entry
    this.selectConfig(this.configs.length - 1);
  }

  removeSelectedConfig(): void {
    // TODO: Ask for confirmation, if yes then
    this.dialog.open(ConfirmationModalComponent, {
      data: { content: [
        "Are you sure you want to delete this configuration?",
        "Warning: Deleted configurations are not recoverable."
        ]
      }
    }).afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      if (this.selectedIndex || this.selectedIndex === 0) {
        this.configs.splice(this.selectedIndex, 1);
      }

      this.selectConfig(undefined);
    });
  }

  copy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  cloneSelectedConfig(): void {
    const chosen = this.configs[this.selectedIndex];
    this.configs.push(this.copy(chosen));
  }

  applySelectedConfig(): boolean {
    if (this.selectedConfigIsValid()) {
      return false;
    }

    this.configs[this.selectedIndex] = this.selectedConfig;
    this.ref.detectChanges();

    return true;
  }
}
