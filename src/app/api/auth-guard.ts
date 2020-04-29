import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { User } from '@api/models/user';
import { UserService } from '@api/services/user.service';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private readonly router: Router, private readonly userService: UserService) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<boolean>((resolve, reject) => {
      this.userService.userGetMe().subscribe(
        (user: User) => {
          if (user) {
            // logged in so return true
            resolve(true);
          }

          // not logged in so redirect to login page with the return url and return false
          this.router.navigate(['login'], { queryParams: { rd: state.url } });
          return resolve(false);
        },
        () => resolve(false)
      );
    });
  }
}
