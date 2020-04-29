import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@framework/core/log.service';
import { AuthService } from '@ngx-auth/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private readonly logger: LogService, private readonly router: Router, private readonly auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // refresh token plz
          const lastRoute = encodeURIComponent(window.origin);
          this.auth.invalidate().then(resp => {
            this.router.navigate(['login', { queryParams: { rd: lastRoute } }]);
          });
        } else {
          return throwError(error);
        }
      })
    );
  }
}
