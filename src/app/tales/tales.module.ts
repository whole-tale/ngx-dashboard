import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '~/app/shared';

import { CopyOnLaunchModalComponent } from './components/modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { RenderedTaleMetadataComponent } from './components/rendered-tale-metadata/rendered-tale-metadata.component';
import { TaleRunButtonComponent } from './components/tale-run-button/tale-run-button.component';
import { TaleCreatorPipe } from './pipes/tale-creator.pipe';
import { TaleImagePipe } from './pipes/tale-image.pipe';
import { TaleNamePipe } from './pipes/tale-name.pipe';
import { TaleVersionNamePipe } from './pipes/tale-version-name.pipe';

@NgModule({
  declarations: [
    CopyOnLaunchModalComponent,
    TaleRunButtonComponent,
    RenderedTaleMetadataComponent,
    TaleCreatorPipe,
    TaleImagePipe,
    TaleNamePipe,
    TaleVersionNamePipe,
  ],
  exports: [
    TaleRunButtonComponent,
    RenderedTaleMetadataComponent,
    CopyOnLaunchModalComponent,
    TaleCreatorPipe,
    TaleImagePipe,
    TaleNamePipe,
    TaleVersionNamePipe,
  ],
  providers: [TaleNamePipe],
  imports: [CommonModule, RouterModule, MaterialModule, MatDialogModule, SharedModule, MarkdownModule],
})
export class TalesModule {}
