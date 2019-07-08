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
class ApiKeyService extends __BaseService {
  static readonly apiKeyListKeysPath = '/api_key';
  static readonly apiKeyCreateKeyPath = '/api_key';
  static readonly apiKeyCreateTokenPath = '/api_key/token';
  static readonly apiKeyDeleteKeyPath = '/api_key/{id}';
  static readonly apiKeyUpdateKeyPath = '/api_key/{id}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Only site administrators may list keys for other users. If no userId parameter is passed, lists keys for the current user.
   * @param params The `ApiKeyService.ApiKeyListKeysParams` containing the following parameters:
   *
   * - `userId`: ID of the user whose keys to list.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  apiKeyListKeysResponse(params: ApiKeyService.ApiKeyListKeysParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/api_key`, __body, {
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
   * Only site administrators may list keys for other users. If no userId parameter is passed, lists keys for the current user.
   * @param params The `ApiKeyService.ApiKeyListKeysParams` containing the following parameters:
   *
   * - `userId`: ID of the user whose keys to list.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  apiKeyListKeys(params: ApiKeyService.ApiKeyListKeysParams): __Observable<null> {
    return this.apiKeyListKeysResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ApiKeyService.ApiKeyCreateKeyParams` containing the following parameters:
   *
   * - `tokenDuration`: Max number of days tokens created with this key will last.
   *
   * - `scope`: JSON list of scopes for this key.
   *
   * - `name`: Name for the API key.
   *
   * - `active`: Whether the key is currently active.
   */
  apiKeyCreateKeyResponse(params: ApiKeyService.ApiKeyCreateKeyParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.tokenDuration != null) __params = __params.set('tokenDuration', params.tokenDuration.toString());
    if (params.scope != null) __params = __params.set('scope', params.scope.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.active != null) __params = __params.set('active', params.active.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/api_key`, __body, {
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
   * @param params The `ApiKeyService.ApiKeyCreateKeyParams` containing the following parameters:
   *
   * - `tokenDuration`: Max number of days tokens created with this key will last.
   *
   * - `scope`: JSON list of scopes for this key.
   *
   * - `name`: Name for the API key.
   *
   * - `active`: Whether the key is currently active.
   */
  apiKeyCreateKey(params: ApiKeyService.ApiKeyCreateKeyParams): __Observable<null> {
    return this.apiKeyCreateKeyResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ApiKeyService.ApiKeyCreateTokenParams` containing the following parameters:
   *
   * - `key`: The API key.
   *
   * - `duration`: Number of days that the token should last.
   */
  apiKeyCreateTokenResponse(params: ApiKeyService.ApiKeyCreateTokenParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.key != null) __params = __params.set('key', params.key.toString());
    if (params.duration != null) __params = __params.set('duration', params.duration.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/api_key/token`, __body, {
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
   * @param params The `ApiKeyService.ApiKeyCreateTokenParams` containing the following parameters:
   *
   * - `key`: The API key.
   *
   * - `duration`: Number of days that the token should last.
   */
  apiKeyCreateToken(params: ApiKeyService.ApiKeyCreateTokenParams): __Observable<null> {
    return this.apiKeyCreateTokenResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the API key to delete.
   */
  apiKeyDeleteKeyResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/api_key/${id}`, __body, {
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
   * @param id The ID of the API key to delete.
   */
  apiKeyDeleteKey(id: string): __Observable<null> {
    return this.apiKeyDeleteKeyResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ApiKeyService.ApiKeyUpdateKeyParams` containing the following parameters:
   *
   * - `id`: The ID of the API key.
   *
   * - `tokenDuration`: Max number of days tokens created with this key will last.
   *
   * - `scope`: JSON list of scopes for this key.
   *
   * - `name`: Name for the key.
   *
   * - `active`: Whether the key is currently active.
   */
  apiKeyUpdateKeyResponse(params: ApiKeyService.ApiKeyUpdateKeyParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.tokenDuration != null) __params = __params.set('tokenDuration', params.tokenDuration.toString());
    if (params.scope != null) __params = __params.set('scope', params.scope.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.active != null) __params = __params.set('active', params.active.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/api_key/${params.id}`, __body, {
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
   * @param params The `ApiKeyService.ApiKeyUpdateKeyParams` containing the following parameters:
   *
   * - `id`: The ID of the API key.
   *
   * - `tokenDuration`: Max number of days tokens created with this key will last.
   *
   * - `scope`: JSON list of scopes for this key.
   *
   * - `name`: Name for the key.
   *
   * - `active`: Whether the key is currently active.
   */
  apiKeyUpdateKey(params: ApiKeyService.ApiKeyUpdateKeyParams): __Observable<null> {
    return this.apiKeyUpdateKeyResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module ApiKeyService {
  /**
   * Parameters for apiKeyListKeys
   */
  export interface ApiKeyListKeysParams {
    /**
     * ID of the user whose keys to list.
     */
    userId?: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * Result set size limit.
     */
    limit?: number;
  }

  /**
   * Parameters for apiKeyCreateKey
   */
  export interface ApiKeyCreateKeyParams {
    /**
     * Max number of days tokens created with this key will last.
     */
    tokenDuration?: string;

    /**
     * JSON list of scopes for this key.
     */
    scope?: string;

    /**
     * Name for the API key.
     */
    name?: string;

    /**
     * Whether the key is currently active.
     */
    active?: boolean;
  }

  /**
   * Parameters for apiKeyCreateToken
   */
  export interface ApiKeyCreateTokenParams {
    /**
     * The API key.
     */
    key: string;

    /**
     * Number of days that the token should last.
     */
    duration?: number;
  }

  /**
   * Parameters for apiKeyUpdateKey
   */
  export interface ApiKeyUpdateKeyParams {
    /**
     * The ID of the API key.
     */
    id: string;

    /**
     * Max number of days tokens created with this key will last.
     */
    tokenDuration?: string;

    /**
     * JSON list of scopes for this key.
     */
    scope?: string;

    /**
     * Name for the key.
     */
    name?: string;

    /**
     * Whether the key is currently active.
     */
    active?: boolean;
  }
}

export { ApiKeyService };
