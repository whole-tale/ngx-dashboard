import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OauthService } from '@api/services/oauth.service';
import { LogService } from '@shared/core/log.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private readonly logger: LogService, private readonly router: Router, private readonly oauth: OauthService) {}

  redirectToLogin(): void {
    // route to login, redirect back here after auth
    const redirect = encodeURIComponent(window.location.href);

    const params = { redirect: `${window.location.origin}/?token={girderToken}&rd=${redirect}`, list: false };
    this.oauth.oauthListProviders(params).subscribe(
      (providers: { Globus: string; Github: string }) => {
        // TODO: How to support multiple providers here?
        window.location.href = providers.Globus;
      },
      (err) => {
        this.logger.error('Failed to GET /oauth/providers:', err);
      }
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.redirectToLogin();
        } else {
          return throwError(error);
        }
      })
    );
  }
}
