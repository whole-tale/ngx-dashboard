import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '@api/models/user';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private readonly router: Router, private readonly userService: UserService, private readonly tokenService: TokenService) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.userService.userGetMe().subscribe(
        (user: User) => {
          const url = state.url.startsWith('/') ? state.url.substring(1) : state.url;

          // not logged in so redirect to login page with the return url and return false
          this.tokenService.setReturnRoute(url);

          if (user) {
            // logged in so return true
            return resolve(true);
          }

          this.router.navigate(['login'], { queryParams: { rd: url } });

          return resolve(false);
        },
        () => resolve(false)
      );
    });
  }
}
