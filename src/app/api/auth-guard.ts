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
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivateChild, CanActivate, CanLoad {
  constructor(private readonly router: Router, private readonly tokenService: TokenService) {}

  // Returns true if the user is logged in
  checkAuth(): boolean {
    if (this.tokenService.user.value && this.tokenService.getToken()) {
      return true;
    }

    // If no user stored in tokenService, redirect to main page
    this.router.navigate(['']);

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
