import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tale } from '@api/models/tale';
import { RepositoryService } from '@api/services/repository.service';
import { VersionService } from '@api/services/version.service';
import { LogService }  from '@framework/core/log.service';
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
  submitLoading = false;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(private logger: LogService,
              private versionService: VersionService,
              private ref: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: { taleId: string, mode: string }) {
                // FIXME: Debounce input
                this.modelChanged.pipe(
                    debounceTime(300),
                    distinctUntilChanged())
                      .subscribe(name => this.name = name);
              }

  async doesNameExist(name: string): Promise<boolean> {
    // Disable Submit button
    this.submitLoading = true;
    this.ref.detectChanges();

    // Then evaluate whether the button should actually be enabled
    // This prevents a race condition in slow connections
    this.modelChanged.next(this.name);

    return this.versionService.versionExists(this.data.taleId, name).toPromise()
      .then((resp: { exists: boolean }) => {
        this.nameAlreadyExists = resp.exists;
        this.submitLoading = false;

        return resp.exists;
      });
  }

  getResult(): { name: string, force?: boolean } {
    if (this.data.mode === 'create') {
      return { 'name': this.name, 'force': this.force };
    } else {
      return { 'name': this.name }
    }
  }
}
