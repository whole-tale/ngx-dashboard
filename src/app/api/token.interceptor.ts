import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { Observable } from 'rxjs';

import { TokenService } from './token.service';

// TODO: Tests

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public tokenService: TokenService, private readonly config: ApiConfiguration) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ignore if we don't have a token
    const token = this.tokenService.getToken();
    if (!token) {
      return next.handle(request);
    }

    // Ignore if this request isn't going to girder
    if (!request.url.startsWith(this.config.rootUrl)) {
      return next.handle(request);
    }

    // Short-circuit for static json files
    // NOTE: This is required to keep the interceptor working.
    // See https://stackoverflow.com/questions/49364756/angular-5-error-endpoint-unreachable
    if (request.url.endsWith('.json')) {
      return next.handle(request); // .do((event: HttpEvent<any>) => { return })
    }

    // For everything else, attach our girder token as a header
    const authRequest = request.clone({
      setHeaders: {
        'Girder-Token': token
      }
    });

    return next.handle(authRequest);
  }
}
