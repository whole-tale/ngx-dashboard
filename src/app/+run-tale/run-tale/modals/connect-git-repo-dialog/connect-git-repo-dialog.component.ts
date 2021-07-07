import { Component } from '@angular/core';

@Component({
  templateUrl: './connect-git-repo-dialog.component.html',
  styleUrls: ['./connect-git-repo-dialog.component.scss']
})
export class ConnectGitRepoDialogComponent {
  gitRepo = '';

  valid(): boolean {
    if (!this.gitRepo || this.gitRepo === '') { return false; }

    // TODO: Validation

    return true;
  }
}
