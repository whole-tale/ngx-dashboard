import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, LAYOUT_CONFIG } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '@framework/core/safe.pipe';
import { TruncatePipe } from '@framework/core/truncate.pipe';
// import { TranslateModule } from '@ngx-translate/core';

export const APP_LAYOUT_CONFIG = {
  addFlexToParent: true,
  addOrientationBps: false,
  disableDefaultBps: false,
  disableVendorPrefixes: false,
  serverLoaded: false,
  useColumnBasisZero: false
};

@NgModule({
  imports: [HttpClientModule],
  declarations: [TruncatePipe, SafePipe],
  exports: [CommonModule, FormsModule, FlexLayoutModule, /* TranslateModule, */ TruncatePipe, SafePipe],
  providers: [
    {
      provide: LAYOUT_CONFIG,
      useValue: APP_LAYOUT_CONFIG
    }
  ]
})
export class SharedModule {}
