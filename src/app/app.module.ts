import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ApiModule } from '@api/api.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CoreModule } from '@shared/core';
import { ErrorHandlerModule } from '@shared/error-handler/error-handler.module';
import { MaterialModule } from '@shared/material';
import { SharedModule } from '@shared/shared.module';
import { SyncService } from '@tales/sync.service';
import { CookieService } from 'ngx-cookie-service';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { MainComponent } from './layout/main.component';
import { NotificationStreamModule } from './layout/notification-stream/notification-stream.module';
import { LoginComponent } from './login/login.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { suppressScrollX: true };

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app-id' }),
    // TransferHttpCacheModule,
    // TransferHttpCacheModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    PerfectScrollbarModule,
    ErrorHandlerModule,
    SharedModule,
    CoreModule.forRoot([]),
    MaterialModule,
    FontAwesomeModule,
    ApiModule,
    NotificationStreamModule,
    ErrorHandlerModule,
  ],
  declarations: [HeaderComponent, FooterComponent, MainComponent, LoginComponent, AppComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    CookieService,
    SyncService,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // TODO: Only add icons we need?
    library.add(fas);
  }
}
