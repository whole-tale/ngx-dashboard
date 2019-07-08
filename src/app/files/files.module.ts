import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { NewFolderDialogComponent } from './file-explorer/modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './file-explorer/modals/rename-dialog/rename-dialog.component';
import { FilesService } from './files.service';

@NgModule({
  declarations: [FileExplorerComponent, NewFolderDialogComponent, RenameDialogComponent],
  exports: [FileExplorerComponent],
  providers: [FilesService],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MatGridListModule,
    MatDialogModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  entryComponents: [NewFolderDialogComponent, RenameDialogComponent]
})
export class FilesModule {}
