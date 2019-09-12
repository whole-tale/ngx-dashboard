import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FilesModule } from '@files/files.module';
import { SharedModule } from '@framework/core';
import { SafePipe } from '@framework/core/safe.pipe';
import { TruncatePipe } from '@framework/core/truncate.pipe';
import { MaterialModule } from '@framework/material';
import { TalesModule } from '@tales/tales.module';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { routes } from './run-tale.routes';
import { RunTaleComponent } from './run-tale/run-tale.component';
import { TaleFilesComponent } from './run-tale/tale-files/tale-files.component';
import { TaleInteractComponent } from './run-tale/tale-interact/tale-interact.component';
import { TaleMetadataComponent } from './run-tale/tale-metadata/tale-metadata.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, FilesModule, TalesModule, MarkdownModule.forRoot()],
  providers: [TruncatePipe, SafePipe],
  declarations: [RunTaleComponent, TaleFilesComponent, TaleMetadataComponent, TaleInteractComponent]
})
export class RunTaleModule {}
