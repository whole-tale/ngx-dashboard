import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale } from '@api/models/tale';
import { RepositoryService } from '@api/services/repository.service';
import { LogService }  from '@framework/core/log.service';

@Component({
  templateUrl: './create-rename-version-dialog.component.html',
  styleUrls: ['./create-rename-version-dialog.component.scss']
})
export class CreateRenameVersionDialogComponent {
  name = "";
  force = true;

  constructor(private logger: LogService,
              @Inject(MAT_DIALOG_DATA) public data: { mode: string }) {}

  getResult(): { name: string, force?: boolean } {
    if (this.data.mode === 'create') {
      return { 'name': this.name, 'force': this.force };
    } else {
      return { 'name': this.name }
    }
  }
}
