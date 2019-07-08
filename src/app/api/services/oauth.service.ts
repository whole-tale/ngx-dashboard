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
class OauthService extends __BaseService {
  static readonly oauthListProvidersPath = '/oauth/provider';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * By default, returns an object mapping names of providers to the appropriate URL.
   * @param params The `OauthService.OauthListProvidersParams` containing the following parameters:
   *
   * - `redirect`: Where the user should be redirected upon completion of the OAuth2 flow.
   *
   * - `list`: Whether to return the providers as an ordered list.
   */
  oauthListProvidersResponse(params: OauthService.OauthListProvidersParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.redirect != null) __params = __params.set('redirect', params.redirect.toString());
    if (params.list != null) __params = __params.set('list', params.list.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/oauth/provider`, __body, {
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
   * By default, returns an object mapping names of providers to the appropriate URL.
   * @param params The `OauthService.OauthListProvidersParams` containing the following parameters:
   *
   * - `redirect`: Where the user should be redirected upon completion of the OAuth2 flow.
   *
   * - `list`: Whether to return the providers as an ordered list.
   */
  oauthListProviders(params: OauthService.OauthListProvidersParams): __Observable<null> {
    return this.oauthListProvidersResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module OauthService {
  /**
   * Parameters for oauthListProviders
   */
  export interface OauthListProvidersParams {
    /**
     * Where the user should be redirected upon completion of the OAuth2 flow.
     */
    redirect: string;

    /**
     * Whether to return the providers as an ordered list.
     */
    list?: boolean;
  }
}

export { OauthService };
