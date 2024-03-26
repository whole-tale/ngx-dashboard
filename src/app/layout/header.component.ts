import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiConfiguration } from '@api/api-configuration';
import { EventData } from '@api/events/event-data';
import { User } from '@api/models/user';
import { OauthService } from '@api/services/oauth.service';
import { UserService } from '@api/services/user.service';
import { WholetaleService } from '@api/services/wholetale.service';
import { TokenService } from '@api/token.service';
import { BaseComponent, LogService } from '@shared/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

import { NotificationStreamService } from './notification-stream/notification-stream.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss'],
  // TODO: maintain immutability
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string;
  subtitle: string;
  user: User = undefined;
  // currentLanguage$: Observable<Language>;
  // availableLanguages: Array<Language>;
  isAuthenticated: boolean; // TODO: access only through getter
  currentRoute = '';
  userSubscription: Subscription;
  settingsSubscription: Subscription;
  @ViewChild('userDropdown') userDropdown: ElementRef;
  // events: Array<EventData>;
  apiRoot: string;
  settings: Map<string, string>;
  logoUrl: string;
  dataUrl: string;

  @Output() readonly toggledNotificationStream: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private readonly zone: NgZone,
    private readonly route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly cookies: CookieService,
    private readonly oauth: OauthService,
    private readonly users: UserService,
    private readonly notificationStream: NotificationStreamService,
    private readonly wholetaleService: WholetaleService,
    private readonly config: ApiConfiguration,
    public tokenService: TokenService
  ) {
    super();

    this.apiRoot = this.config.rootUrl;
    this.logger.info('Using apiRoot', this.apiRoot);

    this.dataUrl = this.config.rootUrl.replace('/api/v1', '/');

    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
      }
    });
  }

  ngOnInit(): void {
    this.title = 'APP_NAME';
    this.subtitle = 'TALE';

    this.settingsSubscription = this.wholetaleService.wholetaleGetSettings().subscribe(
      (settings: Map<string, string>) => {
        this.settings = settings;
        if (settings['wholetale.logo']) {
          this.logoUrl = `${this.apiRoot}/${settings['wholetale.logo']}`;
        }

        this.ref.detectChanges();

        this.logger.info('Fetched settings:', settings);
        this.logger.info('Using logoUrl:', this.logoUrl);
      },
      (err: any) => {
        this.logger.error('Failed to fetch settings:', err);
      }
    );

    const girderToken = this.cookies.get('girderToken');
    if (girderToken) {
      this.tokenService.setToken(girderToken);
    }

    this.userSubscription = this.tokenService.currentUser.subscribe((user) => {
      this.user = user;

      this.ref.detectChanges();

      setTimeout(() => {
        $('#userDropdown').dropdown({ action: 'hide' });
      }, 500);
    });
  }

  ngAfterViewInit(): void {
    this.loginViaQueryStringToken();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.userSubscription?.unsubscribe();
    this.settingsSubscription?.unsubscribe();
  }

  logout(): void {
    this.isAuthenticated = false;
    this.tokenService.user.next(undefined);
    this.cookies.deleteAll();
    const domain = `.${window.location.hostname.split('.').slice(1).join('.')}`;
    this.cookies.delete('girderToken', '/', domain, true, 'None');
    this.tokenService.clearToken();

    this.ref.detectChanges();

    if (this.currentRoute.startsWith('/mine') || this.currentRoute.startsWith('/shared')) {
      this.router.navigate(['public'], { queryParamsHandling: 'preserve' });
    }
  }

  toggleNotificationStream(): void {
    this.notificationStream.openNotificationStream(!this.notificationStream.showNotificationStream);
    // this.toggledNotificationStream.emit();
  }

  loginWith(provider?: string): void {
    // Set return route to current route
    // this.tokenService.setReturnRoute(this.currentRoute);
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);

    // FIXME: is it ok to use window.location.origin here?
    const params = { redirect: `${window.location.origin}/?token={girderToken}&rd=${redirect}`, list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: Map<String, String>) => {
        window.location.href = provider ? providers[provider] : providers[this.config.authProvider];
      },
      (err) => {
        this.logger.error('Failed to GET /oauth/providers:', err);
      }
    );
  }

  loginViaQueryStringToken(): void {
    // Try to scrape token / redirect from query string param
    const token = this.route.snapshot.queryParams.token;
    if (token) {
      this.tokenService.setToken(token);
    }

    this.users.userGetMe().subscribe(
      (user: User) => {
        if (!user) {
          this.logger.debug('Logging in as Anonymous.');

          return;
        }

        this.tokenService.setUser(user);

        // Redirect via querystring param, if provided
        const rd = this.route.snapshot.queryParams.rd;
        if (rd) {
          return this.router.navigateByUrl(rd);
        }

        // If we didn't redirect, we need to enable the navbar dropdown and check for changes
        this.logger.debug('Logging in as:', user);
        this.zone.runOutsideAngular(() => {
          $('.ui.account.dropdown').dropdown({ action: 'hide' });
        });

        this.ref.detectChanges();
      },
      (err) => {
        this.logger.error('Error fetching user:', err);
      }
    );
  }

  get events(): Array<EventData> {
    return this.notificationStream.events;
  }

  get eventCount(): Number {
    if (!this.events) {
      return 0;
    }

    return this.events.length;
  }

  get docUrl(): string {
    return `${window.env.rtdBaseUrl}/users_guide`;
  }
}
