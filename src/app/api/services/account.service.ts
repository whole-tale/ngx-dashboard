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
class AccountService extends __BaseService {
  static readonly accountListAccountPath = '/account';
  static readonly accountCreateApiKeyAccountPath = '/account/{provider}/key';
  static readonly accountRevokeAccountPath = '/account/{provider}/revoke';
  static readonly accountListTargetsPath = '/account/{provider}/targets';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountListAccountsParams` containing the following parameters:
   *
   * - `redirect`: the redirect/callback target after successful OAuth provider connection
   */
  accountListAccountsResponse(params: AccountService.AccountListAccountsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.redirect != null) __params = __params.set('redirect', params.redirect.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/account`, __body, {
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
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountListAccountsParams` containing the following parameters:
   *
   * - `redirect`: the redirect/callback target after successful OAuth provider connection
   */
  accountListAccounts(params: AccountService.AccountListAccountsParams): __Observable<null> {
    return this.accountListAccountsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountListAccountsParams` containing the following parameters:
   *
   * - `provider`: the name of the new account provider
   * - `resource_server`: the resource_server of the new account provider
   * - `key`: the apikey or token of the new account provider
   * - `key_type`: the type of this account provider
   */
  accountCreateApiKeyAccountResponse(params: AccountService.AccountCreateApiKeyAccountParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let provider = params.provider.toString();
    if (params.resource_server != null) __params = __params.set('resource_server', params.resource_server.toString());
    if (params.key != null) __params = __params.set('key', params.key.toString());
    if (params.key_type != null) {
      __params = __params.set('key_type', params.key_type.toString());
    } else {
      __params = __params.set('key_type', 'apikey');
    }
    let req = new HttpRequest<any>('POST', this.rootUrl + `/account/${provider}/key`, __body, {
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
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountCreateApiKeyAccountParams` containing the following parameters:
   *
   * - `provider`: the name of the new account provider
   * - `resource_server`: the resource_server of the new account provider
   * - `key`: the apikey or token of the new account provider
   * - `key_type`: the type of this account provider
   */
  accountCreateApiKeyAccount(params: AccountService.AccountCreateApiKeyAccountParams): __Observable<null> {
    return this.accountCreateApiKeyAccountResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountListAccountsParams` containing the following parameters:
   *
   * - `provider`: the name of the account provider to revoke
   * - `resource_server`: the resource_server of the account provider to revoke
   */
  accountRevokeAccountResponse(params: AccountService.AccountRevokeAccountParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let provider = params.provider.toString();
    if (params.resource_server != null) __params = __params.set('resource_server', params.resource_server.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/account/${provider}/revoke`, __body, {
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
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountRevokeAccountParams` containing the following parameters:
   *
   * - `provider`: the name of the account provider to revoke
   * - `resource_server`: the resource_server of the account provider to revoke
   */
  accountRevokeAccount(params: AccountService.AccountRevokeAccountParams): __Observable<null> {
    return this.accountRevokeAccountResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountListAccountsParams` containing the following parameters:
   *
   * - `provider`: the name of the account provider to revoke
   */
  accountListTargetsResponse(params: AccountService.AccountListTargetsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let provider = params.provider.toString();
    let req = new HttpRequest<any>('GET', this.rootUrl + `/account/${provider}/targets`, __body, {
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
   * Returns a list of external account providers inside along with their URLs
   * @param params The `AccountService.AccountListTargetsParams` containing the following parameters:
   *
   * - `provider`: the name of the account provider to revoke
   */
  accountListTargets(params: AccountService.AccountListTargetsParams): __Observable<null> {
    return this.accountListTargetsResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module AccountService {
  /**
   * Parameters for accountListAccounts
   */
  export interface AccountListAccountsParams {
    /**
     * The redirect/callback target after successful OAuth provider connection
     */
    redirect: string;
  }

  /**
   * Parameters for accountCreateApiKeyAccount
   */
  export interface AccountCreateApiKeyAccountParams {
    /**
     * The name of the new account provider
     */
    provider: string;
    /**
     * The resource_server of the new account provider
     */
    resource_server: string;
    /**
     * The apikey or token of the new account provider
     */
    key: string;
    /**
     * The type of this account provider
     */
    key_type?: string;
  }

  /**
   * Parameters for accountRevokeAccount
   */
  export interface AccountRevokeAccountParams {
    /**
     * The name of the account provider to revoke
     */
    provider: string;
    /**
     * The resource_server of the account provider to revoke
     */
    resource_server?: string;
  }

  /**
   * Parameters for accountListTargets
   */
  export interface AccountListTargetsParams {
    /**
     * The name of the account provider to query
     */
    provider: string;
  }
}

export { AccountService };
