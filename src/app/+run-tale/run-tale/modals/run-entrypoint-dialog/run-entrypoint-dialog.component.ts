import { Component } from '@angular/core';

export const MAIN_ENTRYPOINT_STORAGE_KEY = 'lastMainEntrypoint'

@Component({
  templateUrl: './run-entrypoint-dialog.component.html',
  styleUrls: ['./run-entrypoint-dialog.component.scss']
})
export class RunEntrypointDialogComponent {
  mainEntrypoint = localStorage.getItem(MAIN_ENTRYPOINT_STORAGE_KEY) || 'run.sh';

  valid(): boolean {
    if (!this.mainEntrypoint || this.mainEntrypoint === '') { return false; }

    // TODO: Validation

    return true;
  }
}
