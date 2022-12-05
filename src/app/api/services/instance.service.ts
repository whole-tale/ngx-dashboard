/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
class InstanceService extends __BaseService {
  static readonly instanceListInstancesPath = '/instance';
  static readonly instanceCreateInstancePath = '/instance';
  static readonly instanceDeleteInstancePath = '/instance/{id}';
  static readonly instanceGetInstancePath = '/instance/{id}';
  static readonly instanceUpdateInstancePath = '/instance/{id}';
  static readonly instanceGetInstanceLogsPath = '/instance/{id}/log';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `InstanceService.InstanceListInstancesParams` containing the following parameters:
   *
   * - `userId`: The ID of the instance's creator.
   *
   * - `text`: Perform a full text search for a tale with a matching name.
   *
   * - `taleId`: List all the instanes using this tale.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  instanceListInstancesResponse(params: InstanceService.InstanceListInstancesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.taleId != null) __params = __params.set('taleId', params.taleId.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/instance`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param params The `InstanceService.InstanceListInstancesParams` containing the following parameters:
   *
   * - `userId`: The ID of the instance's creator.
   *
   * - `text`: Perform a full text search for a tale with a matching name.
   *
   * - `taleId`: List all the instanes using this tale.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  instanceListInstances(params: InstanceService.InstanceListInstancesParams): __Observable<null> {
    return this.instanceListInstancesResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * Instantiate a tale.
   * @param params The `InstanceService.InstanceCreateInstanceParams` containing the following parameters:
   *
   * - `taleId`: The ID of a tale used to create an instance.
   *
   * - `spawn`: If false, create only db object without a corresponding container.
   *
   * - `name`: A user-friendly, short name of the tale.
   */
  instanceCreateInstanceResponse(params: InstanceService.InstanceCreateInstanceParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.taleId != null) __params = __params.set('taleId', params.taleId.toString());
    if (params.spawn != null) __params = __params.set('spawn', params.spawn.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/instance`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Instantiate a tale.
   * @param params The `InstanceService.InstanceCreateInstanceParams` containing the following parameters:
   *
   * - `taleId`: The ID of a tale used to create an instance.
   *
   * - `spawn`: If false, create only db object without a corresponding container.
   *
   * - `name`: A user-friendly, short name of the tale.
   */
  instanceCreateInstance(params: InstanceService.InstanceCreateInstanceParams): __Observable<null> {
    return this.instanceCreateInstanceResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  instanceDeleteInstanceResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/instance/${id}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  instanceDeleteInstance(id: string): __Observable<null> {
    return this.instanceDeleteInstanceResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  instanceGetInstanceResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/instance/${id}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  instanceGetInstance(id: string): __Observable<null> {
    return this.instanceGetInstanceResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  instanceUpdateInstanceResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('PUT', this.rootUrl + `/instance/${id}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  instanceUpdateInstance(id: string): __Observable<null> {
    return this.instanceUpdateInstanceResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * Fetch the logs of the running Instance of a Tale.
   *
   * @param id The ID of the Instance.
   */
  instanceGetInstanceLogsResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/instance/${id}/log`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'text',
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id The ID of the document.
   */
  instanceGetInstanceLogs(id: string): __Observable<null> {
    return this.instanceGetInstanceLogsResponse(id).pipe(__map((_r) => _r.body as null));
  }
}

module InstanceService {
  /**
   * Parameters for instanceListInstances
   */
  export interface InstanceListInstancesParams {
    /**
     * The ID of the instance's creator.
     */
    userId?: string;

    /**
     * Perform a full text search for a tale with a matching name.
     */
    text?: string;

    /**
     * List all the instanes using this tale.
     */
    taleId?: string;

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
   * Parameters for instanceCreateInstance
   */
  export interface InstanceCreateInstanceParams {
    /**
     * The ID of a tale used to create an instance.
     */
    taleId: string;

    /**
     * If false, create only db object without a corresponding container.
     */
    spawn?: boolean;

    /**
     * A user-friendly, short name of the tale.
     */
    name?: string;
  }
}

export { InstanceService };
