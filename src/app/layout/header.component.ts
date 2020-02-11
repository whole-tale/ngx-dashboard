import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationStreamService } from '@api/notification-stream.service';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { select, Store } from '@ngrx/store';
import { AuthService } from '@ngx-auth/core';
import { ConfigService } from '@ngx-config/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Language, LanguageSelectors, State } from '~/app/store';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss']
  // TODO: maintain immutability
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends BaseComponent implements OnInit {
  title: string;
  subtitle: string;
  currentLanguage$: Observable<Language>;
  availableLanguages: Array<Language>;
  isAuthenticated: boolean; // TODO: access only through getter
  currentRoute = '';
  user: any;

  constructor(
    private readonly zone: NgZone,
    private readonly ref: ChangeDetectorRef,
    private readonly store$: Store<State>,
    private readonly logger: LogService,
    private readonly config: ConfigService,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly cookies: CookieService,
    private readonly users: UserService,
    private readonly tokenService: TokenService,
    readonly notificationStream: NotificationStreamService
  ) {
    super();

    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
        // this.logger.debug(`Route is now: ${value.url}`);
      }
    });
  }

  ngOnInit(): void {
    this.title = 'APP_NAME';
    this.subtitle = 'TALE';
    this.currentLanguage$ = this.store$.pipe(select(LanguageSelectors.getWorkingLanguage));
    this.availableLanguages = this.config.getSettings('i18n.availableLanguages');
    this.isAuthenticated = this.auth.isAuthenticated;
    this.user = this.tokenService.user;

    this.zone.runOutsideAngular(() => {
      $('.ui.dropdown').dropdown({ action: 'hide' });
    });

    this.users.userGetMe().subscribe((user: any) => {
      this.logger.debug('Logged in as:', user);
      this.user = this.tokenService.user = user;
      this.ref.detectChanges();
    });
  }

  async logout(): Promise<boolean> {
    this.isAuthenticated = false;
    this.cookies.deleteAll();

    return this.auth.invalidate();
  }

  toggleNotificationStream(): void {
    this.notificationStream.openNotificationStream(!this.notificationStream.showNotificationStream);
  }
}
