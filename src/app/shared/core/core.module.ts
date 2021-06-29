import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BaseContainerComponent } from './base-container.component';
import { BaseComponent } from './base.component';
import { LocalConsoleService } from './local-console.service';
import { LogService } from './log.service';
import { RemoteConsoleService } from './remote-console.service';
import { WindowService } from './window.service';

const CORE_PROVIDERS: Array<any> = [RemoteConsoleService, LocalConsoleService, LogService, WindowService];

@NgModule({
  imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), BrowserAnimationsModule],
  declarations: [BaseComponent, BaseContainerComponent],
  providers: [CORE_PROVIDERS]
})
export class CoreModule {
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: configuredProviders
    };
  }

  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule already loaded; import in root module only.');
    }
  }
}
