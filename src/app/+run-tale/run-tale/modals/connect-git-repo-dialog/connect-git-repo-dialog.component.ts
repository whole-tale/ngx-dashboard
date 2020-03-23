import { Component } from '@angular/core';
import { Tale } from '@api/models/tale';
import { LogService }  from '@framework/core/log.service';

@Component({
  templateUrl: './connect-git-repo-dialog.component.html',
  styleUrls: ['./connect-git-repo-dialog.component.scss']
})
export class ConnectGitRepoDialogComponent {
  gitRepo = '';

  constructor(private logger: LogService) {}

  valid(): boolean {
    if (!this.gitRepo || this.gitRepo === '') { return false; }

    // TODO: Validation

    return true;
  }
}
