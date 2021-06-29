import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OauthService } from '@api/services/oauth.service';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { WindowService } from '@framework/core/window.service';
// import { AuthService } from '@ngx-auth/core';
// import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { from as observableFrom, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { routeAnimation } from '~/app/shared';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseComponent implements OnInit {
  username: string;
  password: string;
  isProcessing: boolean;
  note$: Observable<string>;
  error$: Observable<string>;
  isAuthenticated: boolean;

  constructor(
    // private readonly auth: AuthService,
    // private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly logger: LogService,
    private readonly oauth: OauthService,
    private readonly window: WindowService,
    private readonly cookies: CookieService,
    private readonly users: UserService,
    private readonly tokenService: TokenService
  ) {
    super();
  }

  ngOnInit(): void {
    $('.ui.accordion').accordion();

    this.isAuthenticated = false; // this.auth.isAuthenticated;

    // Try to scrape token from query string param
    const token = this.route.snapshot.queryParams.token;
    if (token) {
      this.tokenService.setToken(token);
      this.users.userGetMe().subscribe(
        (user: any) => {
          this.tokenService.user = user;
          const url = this.tokenService.getReturnRoute();
          const segments = url.split('?');

          // Create our first param (path segments)
          const pathSegments = segments[0].split('/');

          // Now parse querystring, if we have one
          const queryParams = {};
          if (segments.length > 1) {
            segments[1].split('&').forEach((param: string) => {
              const kvSegments = param.split('=');
              const key = kvSegments[0];
              if (kvSegments.length > 1) {
                const value = kvSegments[1];
                queryParams[key] = value;
              } else {
                queryParams[key] = true;
              }
            });
          }

          this.logger.debug('Logging in as:', user);
          // this.login();
          this.router.navigate(pathSegments, { queryParams });
        },
        err => {
          this.logger.error('Error fetching user:', err);
        }
      );
    } else if (this.isAuthenticated) {
      // FIXME: This causes an endless redirect loop
      // observableFrom(this.router.navigateByUrl(this.auth.defaultUrl))
      //  .pipe(takeUntil(this.ngUnsubscribe))
      //  .subscribe(() => {
      // Do something
      //  });*/
    }
  }

  gotoHref(href: string): void {
    this.window.location.href = href;
  }

  loginWithGlobus(): void {
    const route = this.tokenService.getReturnRoute();

    // FIXME: is it ok to use window.location.origin here?
    const params = { redirect: `${this.window.location.origin}/login?token={girderToken}&rd=${route}`, list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: any) => {
        this.window.location.href = providers[this.window.env.authProvider];
      },
      err => {
        this.logger.error('Failed to GET /oauth/providers:', err);
      }
    );
  }

  get tosUrl(): string {
    return this.window.env.rtdBaseUrl + '/tos';
  }
}
