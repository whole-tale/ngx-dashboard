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
class ResourceService extends __BaseService {
  static readonly resourceDeletePath = '/resource';
  static readonly resourceListResourcesPath = '/resource';
  static readonly resourceCopyResourcesPath = '/resource/copy';
  static readonly resourceDownloadPath = '/resource/download';
  static readonly resourceDownloadUniqPath = '/resource/download';
  static readonly resourceLookupPath = '/resource/lookup';
  static readonly resourceMoveResourcesPath = '/resource/move';
  static readonly resourceSearchPath = '/resource/search';
  static readonly resourceGetResourcePath = '/resource/{id}';
  static readonly resourcePathPath = '/resource/{id}/path';
  static readonly resourceSetTimestampPath = '/resource/{id}/timestamp';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `ResourceService.ResourceDeleteParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to delete. Each type is a list of ids.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   *
   * - `progress`: Whether to record progress on this task.
   */
  resourceDeleteResponse(params: ResourceService.ResourceDeleteParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.resources != null) __params = __params.set('resources', params.resources.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/resource`, __body, {
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
   * @param params The `ResourceService.ResourceDeleteParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to delete. Each type is a list of ids.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   *
   * - `progress`: Whether to record progress on this task.
   */
  resourceDelete(params: ResourceService.ResourceDeleteParams): __Observable<null> {
    return this.resourceDeleteResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param resources A JSON-encoded set of resources to get. Each type is a list of ids. Only folders and items may be specified. For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   */
  resourceListResourcesResponse(resources: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (resources != null) __params = __params.set('resources', resources.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/resource`, __body, {
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
   * @param resources A JSON-encoded set of resources to get. Each type is a list of ids. Only folders and items may be specified. For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   */
  resourceListResources(resources: string): __Observable<null> {
    return this.resourceListResourcesResponse(resources).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourceCopyResourcesParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to copy. Each type is a list of ids.  Only folders and items may be specified.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   *
   * - `parentType`: Parent type for the new parent of these resources.
   *
   * - `parentId`: Parent ID for the new parent of these resources.
   *
   * - `progress`: Whether to record progress on this task.
   */
  resourceCopyResourcesResponse(params: ResourceService.ResourceCopyResourcesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.resources != null) __params = __params.set('resources', params.resources.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/resource/copy`, __body, {
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
   * @param params The `ResourceService.ResourceCopyResourcesParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to copy. Each type is a list of ids.  Only folders and items may be specified.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   *
   * - `parentType`: Parent type for the new parent of these resources.
   *
   * - `parentId`: Parent ID for the new parent of these resources.
   *
   * - `progress`: Whether to record progress on this task.
   */
  resourceCopyResources(params: ResourceService.ResourceCopyResourcesParams): __Observable<null> {
    return this.resourceCopyResourcesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * This route is also exposed via the POST method because the request parameters can be quite long, and encoding them in the URL (as is standard when using the GET method) can cause the URL to become too long, which causes errors.
   * @param params The `ResourceService.ResourceDownloadParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to download. Each type is a list of ids. For example: {"item": [(item id 1), (item id 2)], "folder": [(folder id 1)]}.
   *
   * - `includeMetadata`: Include any metadata in JSON files in the archive.
   */
  resourceDownloadResponse(params: ResourceService.ResourceDownloadParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.resources != null) __params = __params.set('resources', params.resources.toString());
    if (params.includeMetadata != null) __params = __params.set('includeMetadata', params.includeMetadata.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/resource/download`, __body, {
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
   * This route is also exposed via the POST method because the request parameters can be quite long, and encoding them in the URL (as is standard when using the GET method) can cause the URL to become too long, which causes errors.
   * @param params The `ResourceService.ResourceDownloadParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to download. Each type is a list of ids. For example: {"item": [(item id 1), (item id 2)], "folder": [(folder id 1)]}.
   *
   * - `includeMetadata`: Include any metadata in JSON files in the archive.
   */
  resourceDownload(params: ResourceService.ResourceDownloadParams): __Observable<null> {
    return this.resourceDownloadResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * This route is also exposed via the POST method because the request parameters can be quite long, and encoding them in the URL (as is standard when using the GET method) can cause the URL to become too long, which causes errors.
   * @param params The `ResourceService.ResourceDownloadUniqParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to download. Each type is a list of ids. For example: {"item": [(item id 1), (item id 2)], "folder": [(folder id 1)]}.
   *
   * - `includeMetadata`: Include any metadata in JSON files in the archive.
   */
  resourceDownloadUniqResponse(params: ResourceService.ResourceDownloadUniqParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.resources != null) __params = __params.set('resources', params.resources.toString());
    if (params.includeMetadata != null) __params = __params.set('includeMetadata', params.includeMetadata.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/resource/download`, __body, {
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
   * This route is also exposed via the POST method because the request parameters can be quite long, and encoding them in the URL (as is standard when using the GET method) can cause the URL to become too long, which causes errors.
   * @param params The `ResourceService.ResourceDownloadUniqParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to download. Each type is a list of ids. For example: {"item": [(item id 1), (item id 2)], "folder": [(folder id 1)]}.
   *
   * - `includeMetadata`: Include any metadata in JSON files in the archive.
   */
  resourceDownloadUniq(params: ResourceService.ResourceDownloadUniqParams): __Observable<null> {
    return this.resourceDownloadUniqResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourceLookupParams` containing the following parameters:
   *
   * - `path`: The path of the resource.  The path must be an absolute Unix path starting with either "/user/[user name]", for a user's resources or "/collection/[collection name]", for resources under a collection.
   *
   * - `test`: Specify whether to return None instead of throwing an exception when path doesn't exist.
   */
  resourceLookupResponse(params: ResourceService.ResourceLookupParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.path != null) __params = __params.set('path', params.path.toString());
    if (params.test != null) __params = __params.set('test', params.test.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/resource/lookup`, __body, {
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
   * @param params The `ResourceService.ResourceLookupParams` containing the following parameters:
   *
   * - `path`: The path of the resource.  The path must be an absolute Unix path starting with either "/user/[user name]", for a user's resources or "/collection/[collection name]", for resources under a collection.
   *
   * - `test`: Specify whether to return None instead of throwing an exception when path doesn't exist.
   */
  resourceLookup(params: ResourceService.ResourceLookupParams): __Observable<null> {
    return this.resourceLookupResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourceMoveResourcesParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to move. Each type is a list of ids.  Only folders and items may be specified.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   *
   * - `parentType`: Parent type for the new parent of these resources.
   *
   * - `parentId`: Parent ID for the new parent of these resources.
   *
   * - `progress`: Whether to record progress on this task.
   */
  resourceMoveResourcesResponse(params: ResourceService.ResourceMoveResourcesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.resources != null) __params = __params.set('resources', params.resources.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/resource/move`, __body, {
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
   * @param params The `ResourceService.ResourceMoveResourcesParams` containing the following parameters:
   *
   * - `resources`: A JSON-encoded set of resources to move. Each type is a list of ids.  Only folders and items may be specified.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
   *
   * - `parentType`: Parent type for the new parent of these resources.
   *
   * - `parentId`: Parent ID for the new parent of these resources.
   *
   * - `progress`: Whether to record progress on this task.
   */
  resourceMoveResources(params: ResourceService.ResourceMoveResourcesParams): __Observable<null> {
    return this.resourceMoveResourcesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourceSearchParams` containing the following parameters:
   *
   * - `types`: A JSON list of resource types to search for, e.g. ["user", "folder", "item"].
   *
   * - `q`: The search query.
   *
   * - `offset`: Offset into result set.
   *
   * - `mode`: The search mode. Can always use either a text search or a prefix-based search.
   *
   * - `limit`: Result set size limit.
   *
   * - `level`: Minimum required access level.
   */
  resourceSearchResponse(params: ResourceService.ResourceSearchParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.types != null) __params = __params.set('types', params.types.toString());
    if (params.q != null) __params = __params.set('q', params.q.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.mode != null) __params = __params.set('mode', params.mode.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.level != null) __params = __params.set('level', params.level.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/resource/search`, __body, {
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
   * @param params The `ResourceService.ResourceSearchParams` containing the following parameters:
   *
   * - `types`: A JSON list of resource types to search for, e.g. ["user", "folder", "item"].
   *
   * - `q`: The search query.
   *
   * - `offset`: Offset into result set.
   *
   * - `mode`: The search mode. Can always use either a text search or a prefix-based search.
   *
   * - `limit`: Result set size limit.
   *
   * - `level`: Minimum required access level.
   */
  resourceSearch(params: ResourceService.ResourceSearchParams): __Observable<null> {
    return this.resourceSearchResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourceGetResourceParams` containing the following parameters:
   *
   * - `type`: The type of the resource (item, file, etc.).
   *
   * - `id`: The ID of the resource.
   */
  resourceGetResourceResponse(params: ResourceService.ResourceGetResourceParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.type != null) __params = __params.set('type', params.type.toString());

    let req = new HttpRequest<any>('GET', this.rootUrl + `/resource/${params.id}`, __body, {
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
   * @param params The `ResourceService.ResourceGetResourceParams` containing the following parameters:
   *
   * - `type`: The type of the resource (item, file, etc.).
   *
   * - `id`: The ID of the resource.
   */
  resourceGetResource(params: ResourceService.ResourceGetResourceParams): __Observable<null> {
    return this.resourceGetResourceResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourcePathParams` containing the following parameters:
   *
   * - `type`: The type of the resource (item, file, etc.).
   *
   * - `id`: The ID of the resource.
   */
  resourcePathResponse(params: ResourceService.ResourcePathParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.type != null) __params = __params.set('type', params.type.toString());

    let req = new HttpRequest<any>('GET', this.rootUrl + `/resource/${params.id}/path`, __body, {
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
   * @param params The `ResourceService.ResourcePathParams` containing the following parameters:
   *
   * - `type`: The type of the resource (item, file, etc.).
   *
   * - `id`: The ID of the resource.
   */
  resourcePath(params: ResourceService.ResourcePathParams): __Observable<null> {
    return this.resourcePathResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ResourceService.ResourceSetTimestampParams` containing the following parameters:
   *
   * - `type`: The type of the resource (item, file, etc.).
   *
   * - `id`: The ID of the resource.
   *
   * - `updated`: The new updated timestamp.
   *
   * - `created`: The new created timestamp.
   */
  resourceSetTimestampResponse(params: ResourceService.ResourceSetTimestampParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.type != null) __params = __params.set('type', params.type.toString());

    if (params.updated != null) __params = __params.set('updated', params.updated.toString());
    if (params.created != null) __params = __params.set('created', params.created.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/resource/${params.id}/timestamp`, __body, {
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
   * @param params The `ResourceService.ResourceSetTimestampParams` containing the following parameters:
   *
   * - `type`: The type of the resource (item, file, etc.).
   *
   * - `id`: The ID of the resource.
   *
   * - `updated`: The new updated timestamp.
   *
   * - `created`: The new created timestamp.
   */
  resourceSetTimestamp(params: ResourceService.ResourceSetTimestampParams): __Observable<null> {
    return this.resourceSetTimestampResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module ResourceService {
  /**
   * Parameters for resourceDelete
   */
  export interface ResourceDeleteParams {
    /**
     * A JSON-encoded set of resources to delete. Each type is a list of ids.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
     */
    resources: string;

    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;
  }

  /**
   * Parameters for resourceCopyResources
   */
  export interface ResourceCopyResourcesParams {
    /**
     * A JSON-encoded set of resources to copy. Each type is a list of ids.  Only folders and items may be specified.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
     */
    resources: string;

    /**
     * Parent type for the new parent of these resources.
     */
    parentType: string;

    /**
     * Parent ID for the new parent of these resources.
     */
    parentId: string;

    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;
  }

  /**
   * Parameters for resourceDownload
   */
  export interface ResourceDownloadParams {
    /**
     * A JSON-encoded set of resources to download. Each type is a list of ids. For example: {"item": [(item id 1), (item id 2)], "folder": [(folder id 1)]}.
     */
    resources: string;

    /**
     * Include any metadata in JSON files in the archive.
     */
    includeMetadata?: boolean;
  }

  /**
   * Parameters for resourceDownloadUniq
   */
  export interface ResourceDownloadUniqParams {
    /**
     * A JSON-encoded set of resources to download. Each type is a list of ids. For example: {"item": [(item id 1), (item id 2)], "folder": [(folder id 1)]}.
     */
    resources: string;

    /**
     * Include any metadata in JSON files in the archive.
     */
    includeMetadata?: boolean;
  }

  /**
   * Parameters for resourceLookup
   */
  export interface ResourceLookupParams {
    /**
     * The path of the resource.  The path must be an absolute Unix path starting with either "/user/[user name]", for a user's resources or "/collection/[collection name]", for resources under a collection.
     */
    path: string;

    /**
     * Specify whether to return None instead of throwing an exception when path doesn't exist.
     */
    test?: boolean;
  }

  /**
   * Parameters for resourceMoveResources
   */
  export interface ResourceMoveResourcesParams {
    /**
     * A JSON-encoded set of resources to move. Each type is a list of ids.  Only folders and items may be specified.  For example: {"item": [(item id 1), (item id2)], "folder": [(folder id 1)]}.
     */
    resources: string;

    /**
     * Parent type for the new parent of these resources.
     */
    parentType: 'user' | 'collection' | 'folder';

    /**
     * Parent ID for the new parent of these resources.
     */
    parentId: string;

    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;
  }

  /**
   * Parameters for resourceSearch
   */
  export interface ResourceSearchParams {
    /**
     * A JSON list of resource types to search for, e.g. ["user", "folder", "item"].
     */
    types: string;

    /**
     * The search query.
     */
    q: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * The search mode. Can always use either a text search or a prefix-based search.
     */
    mode?: string;

    /**
     * Result set size limit.
     */
    limit?: number;

    /**
     * Minimum required access level.
     */
    level?: number;
  }

  /**
   * Parameters for resourceGetResource
   */
  export interface ResourceGetResourceParams {
    /**
     * The type of the resource (item, file, etc.).
     */
    type: string;

    /**
     * The ID of the resource.
     */
    id: string;
  }

  /**
   * Parameters for resourcePath
   */
  export interface ResourcePathParams {
    /**
     * The type of the resource (item, file, etc.).
     */
    type: string;

    /**
     * The ID of the resource.
     */
    id: string;
  }

  /**
   * Parameters for resourceSetTimestamp
   */
  export interface ResourceSetTimestampParams {
    /**
     * The type of the resource (item, file, etc.).
     */
    type: string;

    /**
     * The ID of the resource.
     */
    id: string;

    /**
     * The new updated timestamp.
     */
    updated?: string;

    /**
     * The new created timestamp.
     */
    created?: string;
  }
}

export { ResourceService };
