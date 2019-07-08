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
class WorkspaceService extends __BaseService {
  static readonly workspaceListWorkspacesPath = '/workspace';
  static readonly workspaceGetWorkspacePath = '/workspace/{id}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `WorkspaceService.WorkspaceListWorkspacesParams` containing the following parameters:
   *
   * - `userId`: The ID of the parent Tale's creator.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   *
   * - `level`: The minimum access level to the Tale.
   */
  workspaceListWorkspacesResponse(params: WorkspaceService.WorkspaceListWorkspacesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.level != null) __params = __params.set('level', params.level.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/workspace`, __body, {
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
   * @param params The `WorkspaceService.WorkspaceListWorkspacesParams` containing the following parameters:
   *
   * - `userId`: The ID of the parent Tale's creator.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   *
   * - `level`: The minimum access level to the Tale.
   */
  workspaceListWorkspaces(params: WorkspaceService.WorkspaceListWorkspacesParams): __Observable<null> {
    return this.workspaceListWorkspacesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of a Tale
   */
  workspaceGetWorkspaceResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/workspace/${id}`, __body, {
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
   * @param id The ID of a Tale
   */
  workspaceGetWorkspace(id: string): __Observable<null> {
    return this.workspaceGetWorkspaceResponse(id).pipe(__map(_r => _r.body as null));
  }
}

module WorkspaceService {
  /**
   * Parameters for workspaceListWorkspaces
   */
  export interface WorkspaceListWorkspacesParams {
    /**
     * The ID of the parent Tale's creator.
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

    /**
     * The minimum access level to the Tale.
     */
    level?: -1 | 0 | 1 | 2;
  }
}

export { WorkspaceService };
