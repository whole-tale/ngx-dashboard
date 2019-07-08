/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
class TokenService extends __BaseService {
  static readonly tokenCurrentSessionPath = '/token/current';
  static readonly tokenListScopesPath = '/token/scopes';
  static readonly tokenDeleteSessionPath = '/token/session';
  static readonly tokenGetSessionPath = '/token/session';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }
  tokenCurrentSessionResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/token/current`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  tokenCurrentSession(): __Observable<null> {
    return this.tokenCurrentSessionResponse().pipe(__map(_r => _r.body as null));
  }
  tokenListScopesResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/token/scopes`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  tokenListScopes(): __Observable<null> {
    return this.tokenListScopesResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Attempts to delete your authentication cookie.
   */
  tokenDeleteSessionResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/token/session`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Attempts to delete your authentication cookie.
   */
  tokenDeleteSession(): __Observable<null> {
    return this.tokenDeleteSessionResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * If you are logged in, this will return a token associated with that login.
   */
  tokenGetSessionResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/token/session`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map(_r => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * If you are logged in, this will return a token associated with that login.
   */
  tokenGetSession(): __Observable<null> {
    return this.tokenGetSessionResponse().pipe(__map(_r => _r.body as null));
  }
}

module TokenService {}

export { TokenService };
