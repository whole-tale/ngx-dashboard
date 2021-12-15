import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FilesModule } from '@files/files.module';
import { TruncatePipe } from '@shared/common/pipes/truncate.pipe';
import { MaterialModule } from '@shared/material';
import { SharedModule } from '@shared/shared.module';
import { TaleCreatorPipe } from '@tales/pipes/tale-creator.pipe';
import { TaleImagePipe } from '@tales/pipes/tale-image.pipe';
import { TaleNamePipe } from '@tales/pipes/tale-name.pipe';
import { TalesModule } from '@tales/tales.module';
import { MarkdownModule } from 'ngx-markdown';
import { RecordedRunInfoDialogComponent } from '~/app/+run-tale/run-tale/modals/recorded-run-info-dialog/recorded-run-info-dialog.component';

import { routes } from './run-tale.routes';
import { ConnectGitRepoDialogComponent } from './run-tale/modals/connect-git-repo-dialog/connect-git-repo-dialog.component';
import { CreateRenameVersionDialogComponent } from './run-tale/modals/create-rename-version-dialog/create-rename-version-dialog.component';
import { EditRunConfigsDialogComponent } from './run-tale/modals/edit-run-configs-dialog/edit-run-configs-dialog.component';
import { PublishTaleDialogComponent } from './run-tale/modals/publish-tale-dialog/publish-tale-dialog.component';
import { RegisterDataDialogComponent } from './run-tale/modals/register-data-dialog/register-data-dialog.component';
import { RunEntrypointDialogComponent } from './run-tale/modals/run-entrypoint-dialog/run-entrypoint-dialog.component';
import { SelectDataDialogComponent } from './run-tale/modals/select-data-dialog/select-data-dialog.component';
import { TaleVersionInfoDialogComponent } from './run-tale/modals/tale-version-info-dialog/tale-version-info-dialog.component';
import { TaleWorkspacesDialogComponent } from './run-tale/modals/tale-workspaces-dialog/tale-workspaces-dialog.component';
import { RunTaleComponent } from './run-tale/run-tale.component';
import { TaleFilesComponent } from './run-tale/tale-files/tale-files.component';
import { TaleInteractComponent } from './run-tale/tale-interact/tale-interact.component';
import { TaleMetadataComponent } from './run-tale/tale-metadata/tale-metadata.component';
import { TaleSharingComponent } from './run-tale/tale-sharing/tale-sharing.component';
import { TaleVersionsPanelComponent } from './run-tale/tale-versions-panel/tale-versions-panel.component';


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, MatDialogModule, FilesModule, TalesModule, MarkdownModule.forRoot(), SharedModule],
  providers: [TaleCreatorPipe, TaleImagePipe, TaleNamePipe, TruncatePipe],
  exports: [TaleCreatorPipe, TaleImagePipe, TaleNamePipe],
  declarations: [
    RunTaleComponent,
    TaleFilesComponent,
    TaleInteractComponent,
    TaleMetadataComponent,
    TaleVersionsPanelComponent,
    TaleSharingComponent,
    PublishTaleDialogComponent,
    SelectDataDialogComponent,
    RegisterDataDialogComponent,
    TaleWorkspacesDialogComponent,
    ConnectGitRepoDialogComponent,
    CreateRenameVersionDialogComponent,
    TaleVersionInfoDialogComponent,
    EditRunConfigsDialogComponent,
    RunEntrypointDialogComponent,
    RecordedRunInfoDialogComponent
  ],
})
export class RunTaleModule {}
