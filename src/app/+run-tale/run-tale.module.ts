import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FilesModule } from '@files/files.module';
import { SharedModule } from '@framework/core';
import { SafePipe } from '@framework/core/safe.pipe';
import { TruncatePipe } from '@framework/core/truncate.pipe';
import { MaterialModule } from '@framework/material';
import { TaleCreatorPipe } from '@tales/pipes/tale-creator.pipe';
import { TaleImagePipe } from '@tales/pipes/tale-image.pipe';
import { TaleNamePipe } from '@tales/pipes/tale-name.pipe';
import { TalesModule } from '@tales/tales.module';
import { MarkdownModule } from 'ngx-markdown';

import { routes } from './run-tale.routes';
import { EditRunConfigsDialogComponent } from './run-tale/modals/edit-run-configs-dialog/edit-run-configs-dialog.component';
import { ConnectGitRepoDialogComponent } from './run-tale/modals/connect-git-repo-dialog/connect-git-repo-dialog.component';
import { CreateRenameVersionDialogComponent } from './run-tale/modals/create-rename-version-dialog/create-rename-version-dialog.component';
import { PublishTaleDialogComponent } from './run-tale/modals/publish-tale-dialog/publish-tale-dialog.component';
import { RegisterDataDialogComponent } from './run-tale/modals/register-data-dialog/register-data-dialog.component';
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
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, MatDialogModule, FilesModule, TalesModule, MarkdownModule.forRoot()],
  providers: [TruncatePipe, SafePipe, TaleCreatorPipe, TaleImagePipe, TaleNamePipe],
  exports: [TaleCreatorPipe, TaleImagePipe, TaleNamePipe ],
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
  ],
  entryComponents: [PublishTaleDialogComponent, SelectDataDialogComponent, RegisterDataDialogComponent, TaleWorkspacesDialogComponent, ConnectGitRepoDialogComponent, CreateRenameVersionDialogComponent, TaleVersionInfoDialogComponent, EditRunConfigsDialogComponent]
})
export class RunTaleModule {}
