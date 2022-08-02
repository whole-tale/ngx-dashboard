import { NgModule } from '@angular/core';
import { FlexLayoutModule, LAYOUT_CONFIG } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ApiModule } from '@api/api.module';
import { SafePipe } from '@shared/common/pipes/safe.pipe';
import { TruncatePipe } from '@shared/common/pipes/truncate.pipe';
import { MaterialModule } from '@shared/material';

import { CommonModule } from './common/common.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';

export const APP_LAYOUT_CONFIG = {
  addFlexToParent: true,
  addOrientationBps: false,
  disableDefaultBps: false,
  disableVendorPrefixes: false,
  serverLoaded: false,
  useColumnBasisZero: false,
};

const ROOT_URL = window.env.apiUrl;

@NgModule({
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: LAYOUT_CONFIG,
      useValue: APP_LAYOUT_CONFIG,
    },
  ],
  exports: [CommonModule, ErrorHandlerModule, FlexLayoutModule, FormsModule, MaterialModule, SafePipe, TruncatePipe],
})
export class SharedModule {}
