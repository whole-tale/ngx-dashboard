import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from '@ngx-auth/core';
import { ConfigService } from '@ngx-config/core';
import { Observable } from 'rxjs';
import { BaseComponent } from '~/app/framework/core';
import { Language, LanguageSelectors, State } from '~/app/store';

import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { CookieService } from 'ngx-cookie-service';

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
  user: any = null;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly store$: Store<State>,
    private readonly config: ConfigService,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly cookies: CookieService,
    private readonly users: UserService,
    private readonly tokenService: TokenService
  ) {
    super();

    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
        // console.log(`Route is now: ${value.url}`);
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

    $('.ui.dropdown').dropdown({ action: 'hide' });

    this.users.userGetMe().subscribe((user: any) => {
      console.log('Logged in as:', user);
      this.user = this.tokenService.user = user;
      this.ref.detectChanges();
    });
  }

  async logout(): Promise<boolean> {
    this.isAuthenticated = false;
    this.cookies.deleteAll();

    return this.auth.invalidate();
  }
}
