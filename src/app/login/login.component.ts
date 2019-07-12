import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@ngx-auth/core';
import { TranslateService } from '@ngx-translate/core';
import { from as observableFrom, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

import { OauthService } from '@api/services/oauth.service';

import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { CookieService } from 'ngx-cookie-service';
import { WindowService } from '~/app/framework/core/window.service';

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
    private readonly auth: AuthService,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly oauth: OauthService,
    private readonly window: WindowService,
    private readonly cookies: CookieService,
    private readonly users: UserService,
    private readonly tokenService: TokenService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated;
    if (this.isAuthenticated) {
      observableFrom(this.router.navigateByUrl(this.auth.defaultUrl))
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          // Do something
        });
    } else {
      // Try to scrape token from query string param
      const token = this.route.snapshot.queryParams.token;
      if (token) {
        this.tokenService.setToken(token);
        this.users.userGetMe().subscribe(
          (user: any) => {
            this.tokenService.user = user;
            console.log('Logging in as:', user);
            this.login();
          },
          err => {
            console.error('Error fetching user:', err);
          }
        );
      }
    }
  }

  loginWithGlobus(): void {
    const params = { redirect: 'http://localhost:4200/login?token={girderToken}', list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: any) => {
        this.window.location.href = providers.Globus;
      },
      err => {
        console.error('Failed to GET /oauth/providers:', err);
      }
    );
  }

  login(): Observable<boolean> {
    this.isProcessing = true;
    this.note$ = this.translate.get('PUBLIC.LOGIN.NOTE');

    const auth$ = this.auth.authenticate('valid', 'valid').pipe(takeUntil(this.ngUnsubscribe));

    auth$.subscribe(() => {
      this.isProcessing = false;

      if (!this.auth.isAuthenticated) {
        this.error$ = this.translate.get('PUBLIC.LOGIN.ERROR');
      }
    });

    return auth$;
  }
}
