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
class DmService extends __BaseService {
  static readonly dmClearCachePath = '/dm/clearCache';
  static readonly dmGetItemUnfilteredPath = '/dm/fs/item/{itemId}';
  static readonly dmEvictPath = '/dm/fs/{id}/evict';
  static readonly dmGetListingPath = '/dm/fs/{id}/listing';
  static readonly dmGetRawObjectPath = '/dm/fs/{itemId}/raw';
  static readonly dmSetPropertiesPath = '/dm/fs/{id}/setProperties';
  static readonly dmListLocksPath = '/dm/lock';
  static readonly dmAcquireLockPath = '/dm/lock';
  static readonly dmReleaseLockPath = '/dm/lock/{id}';
  static readonly dmGetLockPath = '/dm/lock/{id}';
  static readonly dmDownloadItemPath = '/dm/lock/{id}/download';
  static readonly dmListSessionsPath = '/dm/session';
  static readonly dmCreateSessionPath = '/dm/session';
  static readonly dmRemoveSessionPath = '/dm/session/{id}';
  static readonly dmGetSessionPath = '/dm/session/{id}';
  static readonly dmModifySessionPath = '/dm/session/{id}';
  static readonly dmListLocksForSessionPath = '/dm/session/{sessionId}/lock';
  static readonly dmGetObjectPath = '/dm/session/{id}/object';
  static readonly dmListTransfersForSessionPath = '/dm/session/{id}/transfer';
  static readonly dmListTransfersPath = '/dm/transfer';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param force By default, only items that are not locked are evicted from the cache. That is, items that would otherwise be collectable by the garbage collector. If this parameter is set, evict all items from the cache and forcibly remove all locks associated with them. This is not recommended since the consequences to the consistency of the system are hard to predict.
   */
  dmClearCacheResponse(force?: boolean): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (force != null) __params = __params.set('force', force.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/dm/clearCache`, __body, {
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
   * @param force By default, only items that are not locked are evicted from the cache. That is, items that would otherwise be collectable by the garbage collector. If this parameter is set, evict all items from the cache and forcibly remove all locks associated with them. This is not recommended since the consequences to the consistency of the system are hard to predict.
   */
  dmClearCache(force?: boolean): __Observable<null> {
    return this.dmClearCacheResponse(force).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param itemId The ID of the item.
   */
  dmGetItemUnfilteredResponse(itemId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/fs/item/${itemId}`, __body, {
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
   * @param itemId The ID of the item.
   */
  dmGetItemUnfiltered(itemId: string): __Observable<null> {
    return this.dmGetItemUnfilteredResponse(itemId).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the item.
   */
  dmEvictResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/fs/${id}/evict`, __body, {
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
   * @param id The ID of the item.
   */
  dmEvict(id: string): __Observable<null> {
    return this.dmEvictResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the folder/item.
   */
  dmGetListingResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/fs/${id}/listing`, __body, {
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
   * @param id The ID of the folder/item.
   */
  dmGetListing(id: string): __Observable<null> {
    return this.dmGetListingResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param itemId The ID of the object.
   */
  dmGetRawObjectResponse(itemId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/fs/${itemId}/raw`, __body, {
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
   * @param itemId The ID of the object.
   */
  dmGetRawObject(itemId: string): __Observable<null> {
    return this.dmGetRawObjectResponse(itemId).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the object.
   */
  dmSetPropertiesResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('PUT', this.rootUrl + `/dm/fs/${id}/setProperties`, __body, {
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
   * @param id The ID of the object.
   */
  dmSetProperties(id: string): __Observable<null> {
    return this.dmSetPropertiesResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `DmService.DmListLocksParams` containing the following parameters:
   *
   * - `sessionId`: Restrict results to a single session
   *
   * - `ownerId`: Only return locks with a specific lock owner
   *
   * - `itemId`: Only return locks on a given item
   */
  dmListLocksResponse(params: DmService.DmListLocksParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.sessionId != null) __params = __params.set('sessionId', params.sessionId.toString());
    if (params.ownerId != null) __params = __params.set('ownerId', params.ownerId.toString());
    if (params.itemId != null) __params = __params.set('itemId', params.itemId.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/lock`, __body, {
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
   * @param params The `DmService.DmListLocksParams` containing the following parameters:
   *
   * - `sessionId`: Restrict results to a single session
   *
   * - `ownerId`: Only return locks with a specific lock owner
   *
   * - `itemId`: Only return locks on a given item
   */
  dmListLocks(params: DmService.DmListLocksParams): __Observable<null> {
    return this.dmListLocksResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `DmService.DmAcquireLockParams` containing the following parameters:
   *
   * - `sessionId`: A Data Manager session.
   *
   * - `itemId`: The item to lock
   *
   * - `ownerId`: The lock owner.
   */
  dmAcquireLockResponse(params: DmService.DmAcquireLockParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.sessionId != null) __params = __params.set('sessionId', params.sessionId.toString());
    if (params.itemId != null) __params = __params.set('itemId', params.itemId.toString());
    if (params.ownerId != null) __params = __params.set('ownerId', params.ownerId.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/dm/lock`, __body, {
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
   * @param params The `DmService.DmAcquireLockParams` containing the following parameters:
   *
   * - `sessionId`: A Data Manager session.
   *
   * - `itemId`: The item to lock
   *
   * - `ownerId`: The lock owner.
   */
  dmAcquireLock(params: DmService.DmAcquireLockParams): __Observable<null> {
    return this.dmAcquireLockResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the lock.
   */
  dmReleaseLockResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/dm/lock/${id}`, __body, {
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
   * @param id The ID of the lock.
   */
  dmReleaseLock(id: string): __Observable<null> {
    return this.dmReleaseLockResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the lock.
   */
  dmGetLockResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/lock/${id}`, __body, {
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
   * @param id The ID of the lock.
   */
  dmGetLock(id: string): __Observable<null> {
    return this.dmGetLockResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the lock.
   */
  dmDownloadItemResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/lock/${id}/download`, __body, {
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
   * @param id The ID of the lock.
   */
  dmDownloadItem(id: string): __Observable<null> {
    return this.dmDownloadItemResponse(id).pipe(__map(_r => _r.body as null));
  }
  dmListSessionsResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/session`, __body, {
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
  dmListSessions(): __Observable<null> {
    return this.dmListSessionsResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `DmService.DmCreateSessionParams` containing the following parameters:
   *
   * - `taleId`: An optional id of a Tale. If provided, Tale's involatileData will be used to initialize the session instead of the dataSet parameter.
   *
   * - `dataSet`: An optional data set to initialize the session with. A data set is a list of objects of the form {"itemId": string, "mountPath": string}.
   */
  dmCreateSessionResponse(params: DmService.DmCreateSessionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.taleId != null) __params = __params.set('taleId', params.taleId.toString());
    if (params.dataSet != null) __params = __params.set('dataSet', params.dataSet.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/dm/session`, __body, {
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
   * @param params The `DmService.DmCreateSessionParams` containing the following parameters:
   *
   * - `taleId`: An optional id of a Tale. If provided, Tale's involatileData will be used to initialize the session instead of the dataSet parameter.
   *
   * - `dataSet`: An optional data set to initialize the session with. A data set is a list of objects of the form {"itemId": string, "mountPath": string}.
   */
  dmCreateSession(params: DmService.DmCreateSessionParams): __Observable<null> {
    return this.dmCreateSessionResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the session.
   */
  dmRemoveSessionResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/dm/session/${id}`, __body, {
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
   * @param id The ID of the session.
   */
  dmRemoveSession(id: string): __Observable<null> {
    return this.dmRemoveSessionResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `DmService.DmGetSessionParams` containing the following parameters:
   *
   * - `id`: The ID of the session.
   *
   * - `loadObjects`: If True, the dataSet of the returned session will containtwo additional fields for each entry: "type": "folder"|"item" and "obj": <itemOrFolder>
   */
  dmGetSessionResponse(params: DmService.DmGetSessionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.loadObjects != null) __params = __params.set('loadObjects', params.loadObjects.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/session/${params.id}`, __body, {
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
   * @param params The `DmService.DmGetSessionParams` containing the following parameters:
   *
   * - `id`: The ID of the session.
   *
   * - `loadObjects`: If True, the dataSet of the returned session will containtwo additional fields for each entry: "type": "folder"|"item" and "obj": <itemOrFolder>
   */
  dmGetSession(params: DmService.DmGetSessionParams): __Observable<null> {
    return this.dmGetSessionResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Specifically, allows changing the dataSet of a session, which implies the ability to add/remove folders/files from a live session. Note that removal can fail if a file is in use.
   * @param params The `DmService.DmModifySessionParams` containing the following parameters:
   *
   * - `id`: The ID of the session.
   *
   * - `dataSet`: An optional data set to initialize the session with. A data set is a list of objects of the form {"itemId": string, "mountPath": string}.
   */
  dmModifySessionResponse(params: DmService.DmModifySessionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.dataSet != null) __params = __params.set('dataSet', params.dataSet.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/dm/session/${params.id}`, __body, {
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
   * Specifically, allows changing the dataSet of a session, which implies the ability to add/remove folders/files from a live session. Note that removal can fail if a file is in use.
   * @param params The `DmService.DmModifySessionParams` containing the following parameters:
   *
   * - `id`: The ID of the session.
   *
   * - `dataSet`: An optional data set to initialize the session with. A data set is a list of objects of the form {"itemId": string, "mountPath": string}.
   */
  dmModifySession(params: DmService.DmModifySessionParams): __Observable<null> {
    return this.dmModifySessionResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param sessionId Restrict results to a single session
   */
  dmListLocksForSessionResponse(sessionId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/session/${sessionId}/lock`, __body, {
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
   * @param sessionId Restrict results to a single session
   */
  dmListLocksForSession(sessionId: string): __Observable<null> {
    return this.dmListLocksForSessionResponse(sessionId).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `DmService.DmGetObjectParams` containing the following parameters:
   *
   * - `path`: The path of the object, starting from the mount point.
   *
   * - `id`: The ID of the session.
   *
   * - `children`: Whether to also return a listing of all the children of the object at the specified path
   */
  dmGetObjectResponse(params: DmService.DmGetObjectParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.path != null) __params = __params.set('path', params.path.toString());

    if (params.children != null) __params = __params.set('children', params.children.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/session/${params.id}/object`, __body, {
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
   * @param params The `DmService.DmGetObjectParams` containing the following parameters:
   *
   * - `path`: The path of the object, starting from the mount point.
   *
   * - `id`: The ID of the session.
   *
   * - `children`: Whether to also return a listing of all the children of the object at the specified path
   */
  dmGetObject(params: DmService.DmGetObjectParams): __Observable<null> {
    return this.dmGetObjectResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the session.
   */
  dmListTransfersForSessionResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/session/${id}/transfer`, __body, {
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
   * @param id The ID of the session.
   */
  dmListTransfersForSession(id: string): __Observable<null> {
    return this.dmListTransfersForSessionResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `DmService.DmListTransfersParams` containing the following parameters:
   *
   * - `sessionId`: If specified, only return transfers belonging to a certain session.
   *
   * - `discardOld`: By default, transfers that finished more than 1 minute before this call is made are not returned. Set this to "false" to return all transfers.
   */
  dmListTransfersResponse(params: DmService.DmListTransfersParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.sessionId != null) __params = __params.set('sessionId', params.sessionId.toString());
    if (params.discardOld != null) __params = __params.set('discardOld', params.discardOld.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/dm/transfer`, __body, {
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
   * @param params The `DmService.DmListTransfersParams` containing the following parameters:
   *
   * - `sessionId`: If specified, only return transfers belonging to a certain session.
   *
   * - `discardOld`: By default, transfers that finished more than 1 minute before this call is made are not returned. Set this to "false" to return all transfers.
   */
  dmListTransfers(params: DmService.DmListTransfersParams): __Observable<null> {
    return this.dmListTransfersResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module DmService {
  /**
   * Parameters for dmListLocks
   */
  export interface DmListLocksParams {
    /**
     * Restrict results to a single session
     */
    sessionId?: string;

    /**
     * Only return locks with a specific lock owner
     */
    ownerId?: string;

    /**
     * Only return locks on a given item
     */
    itemId?: string;
  }

  /**
   * Parameters for dmAcquireLock
   */
  export interface DmAcquireLockParams {
    /**
     * A Data Manager session.
     */
    sessionId: string;

    /**
     * The item to lock
     */
    itemId: string;

    /**
     * The lock owner.
     */
    ownerId?: string;
  }

  /**
   * Parameters for dmCreateSession
   */
  export interface DmCreateSessionParams {
    /**
     * An optional id of a Tale. If provided, Tale's involatileData will be used to initialize the session instead of the dataSet parameter.
     */
    taleId?: string;

    /**
     * An optional data set to initialize the session with. A data set is a list of objects of the form {"itemId": string, "mountPath": string}.
     */
    dataSet?: string;
  }

  /**
   * Parameters for dmGetSession
   */
  export interface DmGetSessionParams {
    /**
     * The ID of the session.
     */
    id: string;

    /**
     * If True, the dataSet of the returned session will containtwo additional fields for each entry: "type": "folder"|"item" and "obj": <itemOrFolder>
     */
    loadObjects?: boolean;
  }

  /**
   * Parameters for dmModifySession
   */
  export interface DmModifySessionParams {
    /**
     * The ID of the session.
     */
    id: string;

    /**
     * An optional data set to initialize the session with. A data set is a list of objects of the form {"itemId": string, "mountPath": string}.
     */
    dataSet: string;
  }

  /**
   * Parameters for dmGetObject
   */
  export interface DmGetObjectParams {
    /**
     * The path of the object, starting from the mount point.
     */
    path: string;

    /**
     * The ID of the session.
     */
    id: string;

    /**
     * Whether to also return a listing of all the children of the object at the specified path
     */
    children?: boolean;
  }

  /**
   * Parameters for dmListTransfers
   */
  export interface DmListTransfersParams {
    /**
     * If specified, only return transfers belonging to a certain session.
     */
    sessionId?: string;

    /**
     * By default, transfers that finished more than 1 minute before this call is made are not returned. Set this to "false" to return all transfers.
     */
    discardOld?: string;
  }
}

export { DmService };
