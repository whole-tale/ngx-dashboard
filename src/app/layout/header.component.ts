import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventData } from '@api/events/event-data';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { BaseComponent, LogService } from '@shared/core';
import { CookieService } from 'ngx-cookie-service';

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
export class HeaderComponent extends BaseComponent implements OnInit {
  title: string;
  subtitle: string;
  // currentLanguage$: Observable<Language>;
  // availableLanguages: Array<Language>;
  isAuthenticated: boolean; // TODO: access only through getter
  currentRoute = '';
  user: any;

  // events: Array<EventData>;

  @Output() readonly toggledNotificationStream: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private readonly zone: NgZone,
    private readonly ref: ChangeDetectorRef,
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly cookies: CookieService,
    private readonly users: UserService,
    private readonly tokenService: TokenService,
    private readonly notificationStream: NotificationStreamService
  ) {
    super();

    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
        // this.logger.debug(`Route is now: ${value.url}`);
      }
    });
  }

  ngOnInit(): void {
    this.title = 'APP_NAME';
    this.subtitle = 'TALE';
    this.user = this.tokenService.user;

    this.zone.runOutsideAngular(() => {
      $('.ui.account.dropdown').dropdown({ action: 'hide' });
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
    this.tokenService.clearToken();

    return this.router.navigate(['login']); // this.auth.invalidate();
  }

  toggleNotificationStream(): void {
    this.notificationStream.openNotificationStream(!this.notificationStream.showNotificationStream);
    // this.toggledNotificationStream.emit();
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
