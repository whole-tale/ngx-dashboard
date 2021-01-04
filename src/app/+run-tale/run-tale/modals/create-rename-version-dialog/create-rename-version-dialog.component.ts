import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale } from '@api/models/tale';
import { RepositoryService } from '@api/services/repository.service';
import { LogService }  from '@framework/core/log.service';
import { VersionService } from '@api/services/version.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  templateUrl: './create-rename-version-dialog.component.html',
  styleUrls: ['./create-rename-version-dialog.component.scss']
})
export class CreateRenameVersionDialogComponent {
  name = "";
  force = true;
  nameAlreadyExists = false;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(private logger: LogService,
              private versionService: VersionService,
              @Inject(MAT_DIALOG_DATA) public data: { taleId: string, mode: string }) {
                // FIXME: Debounce input
                this.modelChanged.pipe(
                    debounceTime(300),
                    distinctUntilChanged())
                      .subscribe(name => this.name = name);
              }

  async doesNameExist(name: string): Promise<boolean> {
    this.modelChanged.next(this.name);

    return this.versionService.versionExists(this.data.taleId, name).toPromise()
      .then((resp: { exists: boolean }) => this.nameAlreadyExists = resp.exists);
  }

  getResult(): { name: string, force?: boolean } {
    if (this.data.mode === 'create') {
      return { 'name': this.name, 'force': this.force };
    } else {
      return { 'name': this.name }
    }
  }
}
