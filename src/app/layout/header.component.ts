import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from '@ngx-auth/core';
import { ConfigService } from '@ngx-config/core';
import { Observable } from 'rxjs';
import { BaseComponent } from '~/app/framework/core';
import { Language, LanguageSelectors, State } from '~/app/store';

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

  constructor(
    private readonly store$: Store<State>,
    private readonly config: ConfigService,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    super();

    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
        console.log(`Route is now: ${value.url}`);
      }
    });
  }

  ngOnInit(): void {
    this.title = 'APP_NAME';
    this.subtitle = 'TALE';
    this.currentLanguage$ = this.store$.pipe(select(LanguageSelectors.getWorkingLanguage));
    this.availableLanguages = this.config.getSettings('i18n.availableLanguages');
    this.isAuthenticated = this.auth.isAuthenticated;
  }

  async logout(): Promise<boolean> {
    this.isAuthenticated = false;

    return this.auth.invalidate();
  }
}
