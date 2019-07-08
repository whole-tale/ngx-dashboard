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
class PublishService extends __BaseService {
  static readonly publishDataonePublishPath = '/publish/dataone';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `PublishService.PublishDataonePublishParams` containing the following parameters:
   *
   * - `taleId`: The ID of the tale that is going to be published.
   *
   * - `remoteMemberNode`: The endpoint for the Metacat instance, including the endpoint.
   *   Example: 'https://dev.nceas.ucsb.edu/knb/d1/mn
   *
   * - `coordinatingNode`: The coordinating node that will be managing the package.Example: https://cn.dataone.org/cn/v2 or http://cn-stage-2.test.dataone.org/cn/v2
   *
   * - `authToken`: The user's authentication token for interacting with the DataONE API. In DataONE's case, this is the user's JWTtoken.
   */
  publishDataonePublishResponse(params: PublishService.PublishDataonePublishParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.taleId != null) __params = __params.set('taleId', params.taleId.toString());
    if (params.remoteMemberNode != null) __params = __params.set('remoteMemberNode', params.remoteMemberNode.toString());
    if (params.coordinatingNode != null) __params = __params.set('coordinatingNode', params.coordinatingNode.toString());
    if (params.authToken != null) __params = __params.set('authToken', params.authToken.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/publish/dataone`, __body, {
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
   * @param params The `PublishService.PublishDataonePublishParams` containing the following parameters:
   *
   * - `taleId`: The ID of the tale that is going to be published.
   *
   * - `remoteMemberNode`: The endpoint for the Metacat instance, including the endpoint.
   *   Example: 'https://dev.nceas.ucsb.edu/knb/d1/mn
   *
   * - `coordinatingNode`: The coordinating node that will be managing the package.Example: https://cn.dataone.org/cn/v2 or http://cn-stage-2.test.dataone.org/cn/v2
   *
   * - `authToken`: The user's authentication token for interacting with the DataONE API. In DataONE's case, this is the user's JWTtoken.
   */
  publishDataonePublish(params: PublishService.PublishDataonePublishParams): __Observable<null> {
    return this.publishDataonePublishResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module PublishService {
  /**
   * Parameters for publishDataonePublish
   */
  export interface PublishDataonePublishParams {
    /**
     * The ID of the tale that is going to be published.
     */
    taleId: string;

    /**
     * The endpoint for the Metacat instance, including the endpoint.
     * Example: 'https://dev.nceas.ucsb.edu/knb/d1/mn
     */
    remoteMemberNode: string;

    /**
     * The coordinating node that will be managing the package.Example: https://cn.dataone.org/cn/v2 or http://cn-stage-2.test.dataone.org/cn/v2
     */
    coordinatingNode: string;

    /**
     * The user's authentication token for interacting with the DataONE API. In DataONE's case, this is the user's JWTtoken.
     */
    authToken: string;
  }
}

export { PublishService };
