import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { User } from '@api/models/user';
import { OauthService } from '@api/services/oauth.service';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { LogService } from '@shared/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivateChild, CanActivate, CanLoad {
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService,
    private readonly oauth: OauthService,
    private readonly logger: LogService
  ) {}

  // Returns true if the user is logged in
  checkAuth(): boolean {
    if (this.tokenService.user.value && this.tokenService.getToken()) {
      return true;
    }

    const redirect = encodeURIComponent(window.location.href);

    this.logger.info(`Restricted route is prohibited, routing to signin... ${redirect}`);

    // Set return route to current route
    const route = window.location.href.split(window.origin)[1];
    this.tokenService.setReturnRoute(route);

    // FIXME: is it ok to use window.location.origin here?
    const params = { redirect: `${window.location.origin}/public?token={girderToken}&rd=${route}`, list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: { Globus: string; Github: string }) => {
        // TODO: How to support multiple providers here?
        window.location.href = providers.Globus;
      },
      (err) => {
        this.logger.error('Failed to GET /oauth/providers:', err);
      }
    );

    return false;
  }

  // Returns true if the user is logged in
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth();
  }

  // Returns true if the user is logged in
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth();
  }

  // Returns true if the user is logged in
  canLoad(route: Route, segments: Array<UrlSegment>): boolean {
    return this.checkAuth();
  }
}
