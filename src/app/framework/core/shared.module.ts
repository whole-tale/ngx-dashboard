import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, LAYOUT_CONFIG } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TruncatePipe } from '@framework/core/truncate.pipe';

export const APP_LAYOUT_CONFIG = {
  addFlexToParent: true,
  addOrientationBps: false,
  disableDefaultBps: false,
  disableVendorPrefixes: false,
  serverLoaded: false,
  useColumnBasisZero: false
};

@NgModule({
  declarations: [TruncatePipe],
  exports: [CommonModule, FormsModule, FlexLayoutModule, TranslateModule, TruncatePipe],
  providers: [
    {
      provide: LAYOUT_CONFIG,
      useValue: APP_LAYOUT_CONFIG
    }
  ]
})
export class SharedModule {}
