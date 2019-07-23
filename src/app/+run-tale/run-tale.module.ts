import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { FilesModule } from '@files/files.module';
import { TaleCatalogModule } from '../+tale-catalog/tale-catalog.module';

import { TaleInteractComponent } from './run-tale/tale-interact/tale-interact.component';
import { TaleFilesComponent } from './run-tale/tale-files/tale-files.component';
import { TaleMetadataComponent } from './run-tale/tale-metadata/tale-metadata.component';
import { RunTaleComponent } from './run-tale/run-tale.component';
import { routes } from './run-tale.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, FilesModule, TaleCatalogModule],
  declarations: [RunTaleComponent, TaleFilesComponent, TaleMetadataComponent, TaleInteractComponent]
})
export class RunTaleModule {}
