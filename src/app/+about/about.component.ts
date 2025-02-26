import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OauthService } from '@api/services/oauth.service';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { BaseComponent, LogService } from '@shared/core';
import { CookieService } from 'ngx-cookie-service';
import { routeAnimation } from '~/app/shared';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent extends BaseComponent implements OnInit {
  username: string;
  password: string;
  isProcessing: boolean;
  // note$: Observable<string>;
  // error$: Observable<string>;
  isAuthenticated: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly logger: LogService,
    private readonly oauth: OauthService,
    private readonly cookies: CookieService,
    private readonly users: UserService,
    private readonly tokenService: TokenService,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {
    super();
    this.titleService.setTitle('Sign in to WholeTale');
    this.metaService.updateTag({
      name: 'description',
      content: 'Whole Tale, an open source platform for reproducible computational research.',
    });
  }

  ngOnInit(): void {
    $('.ui.accordion').accordion();

    this.isAuthenticated = false; // this.auth.isAuthenticated;
    // Try to scrape token from query string param
    const token = this.route.snapshot.queryParams.girderToken;
    if (token) {
      this.tokenService.setToken(token);
      // tslint:disable-next-line:comment-type
      /*this.users.userGetMe().subscribe(
        (user: any) => {
          if (!user) {
            this.logger.error('No user found with token.');

            return;
          }

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
        (err) => {
          this.logger.error('Error fetching user:', err);
        }
      );*/
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
    window.location.href = href;
  }

  loginWithGirder(provider: string): void {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);

    // FIXME: is it ok to use window.location.origin here?
    const params = { redirect: `${window.location.origin}/?girderToken={girderToken}&rd=${redirect}`, list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: any) => {
        window.location.href = providers[provider];
      },
      (err) => {
        this.logger.error('Failed to GET /oauth/providers:', err);
      }
    );
  }

  loginAsAnonymous(): void {
    this.router.navigateByUrl('/public');
  }

  get tosUrl(): string {
    return `${window.env.rtdBaseUrl}/tos`;
  }
}
