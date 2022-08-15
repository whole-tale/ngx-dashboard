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
import { EventData } from '@api/events/event-data';
import { User } from '@api/models/user';
import { OauthService } from '@api/services/oauth.service';
import { UserService } from '@api/services/user.service';
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
  @ViewChild('userDropdown') userDropdown: ElementRef;
  // events: Array<EventData>;

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
    public tokenService: TokenService
  ) {
    super();

    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
      }
    });
  }

  ngOnInit(): void {
    this.title = 'APP_NAME';
    this.subtitle = 'TALE';

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
  }

  logout(): void {
    this.isAuthenticated = false;
    this.tokenService.user.next(undefined);
    this.cookies.deleteAll();
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

  loginWith(provider: string): void {
    // Set return route to current route
    // this.tokenService.setReturnRoute(this.currentRoute);
    const redirect = encodeURIComponent(window.location.href);

    // FIXME: is it ok to use window.location.origin here?
    const params = { redirect: `${window.location.origin}/?token={girderToken}&rd=${redirect}`, list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: any) => {
        window.location.href = providers[provider];
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
          const route = rd.split(window.origin)[1];
          this.router.navigateByUrl(route).then(() => {
            this.notificationStream.connect();
          });

          return;
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
