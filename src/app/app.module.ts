import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule, makeStateKey } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ApiModule } from '@api/api.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ConfigLoader, ConfigService } from '@ngx-config/core';
import { MetaLoader } from '@ngx-meta/core';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ErrorHandlerModule } from '@shared/error-handler/error-handler.module';
import { ANGULARTICS2_TOKEN } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { CookieService } from 'ngx-cookie-service';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AnalyticsModule } from '~/app/framework/analytics';
import { configFactory, CoreModule, metaFactory, SharedModule } from '~/app/framework/core';
import { HttpInterceptorModule } from '~/app/framework/http';
import { ChangeLanguageComponent, I18NModule, translateFactory } from '~/app/framework/i18n';
import { MaterialModule } from '~/app/framework/material';
import { StoreModule } from '~/app/store';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { MainComponent } from './layout/main.component';
import { NotificationStreamModule } from './layout/notification-stream/notification-stream.module';
import { LoginComponent } from './login/login.component';

export const REQ_KEY = makeStateKey<string>('req');

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { suppressScrollX: true };

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app-id' }),
    TransferHttpCacheModule,
    RouterModule.forRoot(routes),
    PerfectScrollbarModule,
    ErrorHandlerModule,
    AnalyticsModule.forRoot([
      {
        provide: ANGULARTICS2_TOKEN,
        useValue: {
          providers: [Angulartics2GoogleAnalytics],
          settings: {}
        }
      }
    ]),
    CoreModule.forRoot([
      {
        provide: ConfigLoader,
        useFactory: configFactory,
        deps: [Injector]
      },
      {
        provide: MetaLoader,
        useFactory: metaFactory,
        deps: [ConfigService, TranslateService]
      }
    ]),
    SharedModule,
    HttpInterceptorModule,
    I18NModule.forRoot([
      {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient]
      }
    ]),
    MaterialModule,
    StoreModule.forRoot(),
    FontAwesomeModule,
    ApiModule,
    NotificationStreamModule
  ],
  declarations: [HeaderComponent, FooterComponent, MainComponent, LoginComponent, AppComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    CookieService
  ],
  exports: [AppComponent],
  entryComponents: [ChangeLanguageComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // TODO: Only add icons we need?
    library.add(fas);
  }
}
