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
class ItemService extends __BaseService {
  static readonly itemFindPath = '/item';
  static readonly itemCreateItemPath = '/item';
  static readonly itemDeleteItemPath = '/item/{id}';
  static readonly itemGetItemPath = '/item/{id}';
  static readonly itemUpdateItemPath = '/item/{id}';
  static readonly itemCopyItemPath = '/item/{id}/copy';
  static readonly itemDownloadPath = '/item/{id}/download';
  static readonly itemGetFilesPath = '/item/{id}/files';
  static readonly itemListItemPath = '/item/{id}/listing';
  static readonly itemDeleteMetadataPath = '/item/{id}/metadata';
  static readonly itemSetMetadataPath = '/item/{id}/metadata';
  static readonly itemRootpathPath = '/item/{id}/rootpath';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * You must pass either a "itemId" or "text" field to specify how you are searching for items.  If you omit one of these parameters the request will fail and respond : "Invalid search mode."
   * @param params The `ItemService.ItemFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a full text search for items.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `name`: Pass to lookup an item by exact name match. Must pass folderId as well when using this.
   *
   * - `limit`: Result set size limit.
   *
   * - `folderId`: Pass this to list all items in a folder.
   */
  itemFindResponse(params: ItemService.ItemFindParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.folderId != null) __params = __params.set('folderId', params.folderId.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/item`, __body, {
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
   * You must pass either a "itemId" or "text" field to specify how you are searching for items.  If you omit one of these parameters the request will fail and respond : "Invalid search mode."
   * @param params The `ItemService.ItemFindParams` containing the following parameters:
   *
   * - `text`: Pass this to perform a full text search for items.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `name`: Pass to lookup an item by exact name match. Must pass folderId as well when using this.
   *
   * - `limit`: Result set size limit.
   *
   * - `folderId`: Pass this to list all items in a folder.
   */
  itemFind(params: ItemService.ItemFindParams): __Observable<null> {
    return this.itemFindResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ItemService.ItemCreateItemParams` containing the following parameters:
   *
   * - `name`: Name for the item.
   *
   * - `folderId`: The ID of the parent folder.
   *
   * - `reuseExisting`: Return existing item (by name) if it exists.
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `description`: Description for the item.
   */
  itemCreateItemResponse(params: ItemService.ItemCreateItemParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.folderId != null) __params = __params.set('folderId', params.folderId.toString());
    if (params.reuseExisting != null) __params = __params.set('reuseExisting', params.reuseExisting.toString());
    if (params.metadata !== null && typeof params.metadata !== 'undefined') {
      __formData.append('metadata', params.metadata as string | Blob);
    }
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/item`, __body, {
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
   * @param params The `ItemService.ItemCreateItemParams` containing the following parameters:
   *
   * - `name`: Name for the item.
   *
   * - `folderId`: The ID of the parent folder.
   *
   * - `reuseExisting`: Return existing item (by name) if it exists.
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `description`: Description for the item.
   */
  itemCreateItem(params: ItemService.ItemCreateItemParams): __Observable<null> {
    return this.itemCreateItemResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  itemDeleteItemResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/item/${id}`, __body, {
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
  itemDeleteItem(id: string): __Observable<null> {
    return this.itemDeleteItemResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  itemGetItemResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/item/${id}`, __body, {
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
  itemGetItem(id: string): __Observable<null> {
    return this.itemGetItemResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ItemService.ItemUpdateItemParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `name`: Name for the item.
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `folderId`: Pass this to move the item to a new folder.
   *
   * - `description`: Description for the item.
   */
  itemUpdateItemResponse(params: ItemService.ItemUpdateItemParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;

    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.metadata !== null && typeof params.metadata !== 'undefined') {
      __formData.append('metadata', params.metadata as string | Blob);
    }
    if (params.folderId != null) __params = __params.set('folderId', params.folderId.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/item/${params.id}`, __body, {
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
   * @param params The `ItemService.ItemUpdateItemParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `name`: Name for the item.
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `folderId`: Pass this to move the item to a new folder.
   *
   * - `description`: Description for the item.
   */
  itemUpdateItem(params: ItemService.ItemUpdateItemParams): __Observable<null> {
    return this.itemUpdateItemResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * If no folderId parameter is specified, creates a copy of the item in its current containing folder.
   * @param params The `ItemService.ItemCopyItemParams` containing the following parameters:
   *
   * - `id`: The ID of the original item.
   *
   * - `name`: Name for the new item.
   *
   * - `folderId`: The ID of the parent folder.
   *
   * - `description`: Description for the new item.
   */
  itemCopyItemResponse(params: ItemService.ItemCopyItemParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.folderId != null) __params = __params.set('folderId', params.folderId.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/item/${params.id}/copy`, __body, {
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
   * If no folderId parameter is specified, creates a copy of the item in its current containing folder.
   * @param params The `ItemService.ItemCopyItemParams` containing the following parameters:
   *
   * - `id`: The ID of the original item.
   *
   * - `name`: Name for the new item.
   *
   * - `folderId`: The ID of the parent folder.
   *
   * - `description`: Description for the new item.
   */
  itemCopyItem(params: ItemService.ItemCopyItemParams): __Observable<null> {
    return this.itemCopyItemResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ItemService.ItemDownloadParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `offset`: Byte offset into the file.
   *
   * - `format`: If unspecified, items with one file are downloaded as that file, and other items are downloaded as a zip archive.  If 'zip', a zip archive is always sent.
   *
   * - `extraParameters`: Arbitrary data to send along with the download request, only applied for single file items.
   *
   * - `contentDisposition`: Specify the Content-Disposition response header disposition-type value, only applied for single file items.
   */
  itemDownloadResponse(params: ItemService.ItemDownloadParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.format != null) __params = __params.set('format', params.format.toString());
    if (params.extraParameters != null) __params = __params.set('extraParameters', params.extraParameters.toString());
    if (params.contentDisposition != null) __params = __params.set('contentDisposition', params.contentDisposition.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/item/${params.id}/download`, __body, {
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
   * @param params The `ItemService.ItemDownloadParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `offset`: Byte offset into the file.
   *
   * - `format`: If unspecified, items with one file are downloaded as that file, and other items are downloaded as a zip archive.  If 'zip', a zip archive is always sent.
   *
   * - `extraParameters`: Arbitrary data to send along with the download request, only applied for single file items.
   *
   * - `contentDisposition`: Specify the Content-Disposition response header disposition-type value, only applied for single file items.
   */
  itemDownload(params: ItemService.ItemDownloadParams): __Observable<null> {
    return this.itemDownloadResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ItemService.ItemGetFilesParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  itemGetFilesResponse(params: ItemService.ItemGetFilesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/item/${params.id}/files`, __body, {
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
   * @param params The `ItemService.ItemGetFilesParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  itemGetFiles(params: ItemService.ItemGetFilesParams): __Observable<null> {
    return this.itemGetFilesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the folder.
   */
  itemListItemResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/item/${id}/listing`, __body, {
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
   * @param id The ID of the folder.
   */
  itemListItem(id: string): __Observable<null> {
    return this.itemListItemResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ItemService.ItemDeleteMetadataParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `fields`: A JSON list containing the metadata fields to delete
   */
  itemDeleteMetadataResponse(params: ItemService.ItemDeleteMetadataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.fields;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/item/${params.id}/metadata`, __body, {
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
   * @param params The `ItemService.ItemDeleteMetadataParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `fields`: A JSON list containing the metadata fields to delete
   */
  itemDeleteMetadata(params: ItemService.ItemDeleteMetadataParams): __Observable<null> {
    return this.itemDeleteMetadataResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Set metadata fields to null in order to delete them.
   * @param params The `ItemService.ItemSetMetadataParams` containing the following parameters:
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `id`: The ID of the document.
   *
   * - `allowNull`: Whether "null" is allowed as a metadata value.
   */
  itemSetMetadataResponse(params: ItemService.ItemSetMetadataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.metadata;

    if (params.allowNull != null) __params = __params.set('allowNull', params.allowNull.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/item/${params.id}/metadata`, __body, {
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
   * Set metadata fields to null in order to delete them.
   * @param params The `ItemService.ItemSetMetadataParams` containing the following parameters:
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `id`: The ID of the document.
   *
   * - `allowNull`: Whether "null" is allowed as a metadata value.
   */
  itemSetMetadata(params: ItemService.ItemSetMetadataParams): __Observable<null> {
    return this.itemSetMetadataResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  itemRootpathResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/item/${id}/rootpath`, __body, {
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
  itemRootpath(id: string): __Observable<null> {
    return this.itemRootpathResponse(id).pipe(__map(_r => _r.body as null));
  }
}

module ItemService {
  /**
   * Parameters for itemFind
   */
  export interface ItemFindParams {
    /**
     * Pass this to perform a full text search for items.
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
     * Pass to lookup an item by exact name match. Must pass folderId as well when using this.
     */
    name?: string;

    /**
     * Result set size limit.
     */
    limit?: number;

    /**
     * Pass this to list all items in a folder.
     */
    folderId?: string;
  }

  /**
   * Parameters for itemCreateItem
   */
  export interface ItemCreateItemParams {
    /**
     * Name for the item.
     */
    name: string;

    /**
     * The ID of the parent folder.
     */
    folderId: string;

    /**
     * Return existing item (by name) if it exists.
     */
    reuseExisting?: boolean;

    /**
     * A JSON object containing the metadata keys to add
     */
    metadata?: string;

    /**
     * Description for the item.
     */
    description?: string;
  }

  /**
   * Parameters for itemUpdateItem
   */
  export interface ItemUpdateItemParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Name for the item.
     */
    name?: string;

    /**
     * A JSON object containing the metadata keys to add
     */
    metadata?: string;

    /**
     * Pass this to move the item to a new folder.
     */
    folderId?: string;

    /**
     * Description for the item.
     */
    description?: string;
  }

  /**
   * Parameters for itemCopyItem
   */
  export interface ItemCopyItemParams {
    /**
     * The ID of the original item.
     */
    id: string;

    /**
     * Name for the new item.
     */
    name?: string;

    /**
     * The ID of the parent folder.
     */
    folderId?: string;

    /**
     * Description for the new item.
     */
    description?: string;
  }

  /**
   * Parameters for itemDownload
   */
  export interface ItemDownloadParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Byte offset into the file.
     */
    offset?: number;

    /**
     * If unspecified, items with one file are downloaded as that file, and other items are downloaded as a zip archive.  If 'zip', a zip archive is always sent.
     */
    format?: string;

    /**
     * Arbitrary data to send along with the download request, only applied for single file items.
     */
    extraParameters?: string;

    /**
     * Specify the Content-Disposition response header disposition-type value, only applied for single file items.
     */
    contentDisposition?: 'inline' | 'attachment';
  }

  /**
   * Parameters for itemGetFiles
   */
  export interface ItemGetFilesParams {
    /**
     * The ID of the document.
     */
    id: string;

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
   * Parameters for itemDeleteMetadata
   */
  export interface ItemDeleteMetadataParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * A JSON list containing the metadata fields to delete
     */
    fields: string;
  }

  /**
   * Parameters for itemSetMetadata
   */
  export interface ItemSetMetadataParams {
    /**
     * A JSON object containing the metadata keys to add
     */
    metadata: string;

    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Whether "null" is allowed as a metadata value.
     */
    allowNull?: boolean;
  }
}

export { ItemService };
