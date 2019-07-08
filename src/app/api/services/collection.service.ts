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
class CollectionService extends __BaseService {
  static readonly collectionFindPath = '/collection';
  static readonly collectionCreateCollectionPath = '/collection';
  static readonly collectionDeleteCollectionPath = '/collection/{id}';
  static readonly collectionGetCollectionPath = '/collection/{id}';
  static readonly collectionUpdateCollectionPath = '/collection/{id}';
  static readonly collectionGetCollectionAccessPath = '/collection/{id}/access';
  static readonly collectionUpdateCollectionAccessPath = '/collection/{id}/access';
  static readonly collectionGetCollectionDetailsPath = '/collection/{id}/details';
  static readonly collectionDownloadCollectionPath = '/collection/{id}/download';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `CollectionService.CollectionFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a text search for collections.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  collectionFindResponse(params: CollectionService.CollectionFindParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/collection`, __body, {
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
   * @param params The `CollectionService.CollectionFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a text search for collections.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  collectionFind(params: CollectionService.CollectionFindParams): __Observable<null> {
    return this.collectionFindResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `CollectionService.CollectionCreateCollectionParams` containing the following parameters:
   *
   * - `name`: Name for the collection. Must be unique.
   *
   * - `public`: Whether the collection should be publicly visible.
   *
   * - `description`: Collection description.
   */
  collectionCreateCollectionResponse(params: CollectionService.CollectionCreateCollectionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/collection`, __body, {
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
   * @param params The `CollectionService.CollectionCreateCollectionParams` containing the following parameters:
   *
   * - `name`: Name for the collection. Must be unique.
   *
   * - `public`: Whether the collection should be publicly visible.
   *
   * - `description`: Collection description.
   */
  collectionCreateCollection(params: CollectionService.CollectionCreateCollectionParams): __Observable<null> {
    return this.collectionCreateCollectionResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  collectionDeleteCollectionResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/collection/${id}`, __body, {
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
   * @param id The ID of the document.
   */
  collectionDeleteCollection(id: string): __Observable<null> {
    return this.collectionDeleteCollectionResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  collectionGetCollectionResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/collection/${id}`, __body, {
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
   * @param id The ID of the document.
   */
  collectionGetCollection(id: string): __Observable<null> {
    return this.collectionGetCollectionResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `CollectionService.CollectionUpdateCollectionParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `name`: Unique name for the collection.
   *
   * - `description`: Collection description.
   */
  collectionUpdateCollectionResponse(params: CollectionService.CollectionUpdateCollectionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/collection/${params.id}`, __body, {
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
   * @param params The `CollectionService.CollectionUpdateCollectionParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `name`: Unique name for the collection.
   *
   * - `description`: Collection description.
   */
  collectionUpdateCollection(params: CollectionService.CollectionUpdateCollectionParams): __Observable<null> {
    return this.collectionUpdateCollectionResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  collectionGetCollectionAccessResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/collection/${id}/access`, __body, {
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
   * @param id The ID of the document.
   */
  collectionGetCollectionAccess(id: string): __Observable<null> {
    return this.collectionGetCollectionAccessResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `CollectionService.CollectionUpdateCollectionAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The access control list as JSON.
   *
   * - `recurse`: Whether the policies should be applied to all folders under this collection as well.
   *
   * - `publicFlags`: List of public access flags to set on the collection.
   *
   * - `public`: Whether the collection should be publicly visible.
   *
   * - `progress`: If recurse is set to True, this controls whether progress notifications will be sent.
   */
  collectionUpdateCollectionAccessResponse(
    params: CollectionService.CollectionUpdateCollectionAccessParams
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.access != null) __params = __params.set('access', params.access.toString());
    if (params.recurse != null) __params = __params.set('recurse', params.recurse.toString());
    if (params.publicFlags != null) __params = __params.set('publicFlags', params.publicFlags.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/collection/${params.id}/access`, __body, {
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
   * @param params The `CollectionService.CollectionUpdateCollectionAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The access control list as JSON.
   *
   * - `recurse`: Whether the policies should be applied to all folders under this collection as well.
   *
   * - `publicFlags`: List of public access flags to set on the collection.
   *
   * - `public`: Whether the collection should be publicly visible.
   *
   * - `progress`: If recurse is set to True, this controls whether progress notifications will be sent.
   */
  collectionUpdateCollectionAccess(params: CollectionService.CollectionUpdateCollectionAccessParams): __Observable<null> {
    return this.collectionUpdateCollectionAccessResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  collectionGetCollectionDetailsResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/collection/${id}/details`, __body, {
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
   * @param id The ID of the document.
   */
  collectionGetCollectionDetails(id: string): __Observable<null> {
    return this.collectionGetCollectionDetailsResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `CollectionService.CollectionDownloadCollectionParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `mimeFilter`: JSON list of MIME types to include.
   */
  collectionDownloadCollectionResponse(
    params: CollectionService.CollectionDownloadCollectionParams
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.mimeFilter != null) __params = __params.set('mimeFilter', params.mimeFilter.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/collection/${params.id}/download`, __body, {
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
   * @param params The `CollectionService.CollectionDownloadCollectionParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `mimeFilter`: JSON list of MIME types to include.
   */
  collectionDownloadCollection(params: CollectionService.CollectionDownloadCollectionParams): __Observable<null> {
    return this.collectionDownloadCollectionResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module CollectionService {
  /**
   * Parameters for collectionFind
   */
  export interface CollectionFindParams {
    /**
     * Pass this to perform a text search for collections.
     */
    text?: string;

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
   * Parameters for collectionCreateCollection
   */
  export interface CollectionCreateCollectionParams {
    /**
     * Name for the collection. Must be unique.
     */
    name: string;

    /**
     * Whether the collection should be publicly visible.
     */
    public?: boolean;

    /**
     * Collection description.
     */
    description?: string;
  }

  /**
   * Parameters for collectionUpdateCollection
   */
  export interface CollectionUpdateCollectionParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Unique name for the collection.
     */
    name?: string;

    /**
     * Collection description.
     */
    description?: string;
  }

  /**
   * Parameters for collectionUpdateCollectionAccess
   */
  export interface CollectionUpdateCollectionAccessParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The access control list as JSON.
     */
    access: string;

    /**
     * Whether the policies should be applied to all folders under this collection as well.
     */
    recurse?: boolean;

    /**
     * List of public access flags to set on the collection.
     */
    publicFlags?: string;

    /**
     * Whether the collection should be publicly visible.
     */
    public?: boolean;

    /**
     * If recurse is set to True, this controls whether progress notifications will be sent.
     */
    progress?: boolean;
  }

  /**
   * Parameters for collectionDownloadCollection
   */
  export interface CollectionDownloadCollectionParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * JSON list of MIME types to include.
     */
    mimeFilter?: string;
  }
}

export { CollectionService };
