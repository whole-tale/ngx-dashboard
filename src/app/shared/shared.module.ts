import { NgModule } from '@angular/core';
import { SharedModule as SharedFrameworkModule } from '@framework/core';
import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from './common/common.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';

@NgModule({
  providers: [],
  exports: [TranslateModule, SharedFrameworkModule, CommonModule, ErrorHandlerModule]
})
export class SharedModule {}
