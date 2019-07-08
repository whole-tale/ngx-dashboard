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
class FolderService extends __BaseService {
  static readonly folderFindPath = '/folder';
  static readonly folderCreateFolderPath = '/folder';
  static readonly folderListImportedDataPath = '/folder/registered';
  static readonly folderDeleteFolderPath = '/folder/{id}';
  static readonly folderGetFolderPath = '/folder/{id}';
  static readonly folderUpdateFolderPath = '/folder/{id}';
  static readonly folderGetFolderAccessPath = '/folder/{id}/access';
  static readonly folderUpdateFolderAccessPath = '/folder/{id}/access';
  static readonly folderDeleteContentsPath = '/folder/{id}/contents';
  static readonly folderCopyFolderPath = '/folder/{id}/copy';
  static readonly folderGetDataSetPath = '/folder/{id}/dataset';
  static readonly folderGetFolderDetailsPath = '/folder/{id}/details';
  static readonly folderDownloadFolderPath = '/folder/{id}/download';
  static readonly folderListFolderPath = '/folder/{id}/listing';
  static readonly folderDeleteMetadataPath = '/folder/{id}/metadata';
  static readonly folderSetMetadataPath = '/folder/{id}/metadata';
  static readonly folderRootpathPath = '/folder/{id}/rootpath';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * You must pass either a "folderId" or "text" field to specify how you are searching for folders.  If you omit one of these parameters the request will fail and respond : "Invalid search mode."
   * @param params The `FolderService.FolderFindParams` containing the following parameters:
   *
   * - `text`: Pass to perform a text search.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: The ID of the folder's parent.
   *
   * - `offset`: Offset into result set.
   *
   * - `name`: Pass to lookup a folder by exact name match. Must pass parentType and parentId as well when using this.
   *
   * - `limit`: Result set size limit.
   */
  folderFindResponse(params: FolderService.FolderFindParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder`, __body, {
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
   * You must pass either a "folderId" or "text" field to specify how you are searching for folders.  If you omit one of these parameters the request will fail and respond : "Invalid search mode."
   * @param params The `FolderService.FolderFindParams` containing the following parameters:
   *
   * - `text`: Pass to perform a text search.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: The ID of the folder's parent.
   *
   * - `offset`: Offset into result set.
   *
   * - `name`: Pass to lookup a folder by exact name match. Must pass parentType and parentId as well when using this.
   *
   * - `limit`: Result set size limit.
   */
  folderFind(params: FolderService.FolderFindParams): __Observable<null> {
    return this.folderFindResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderCreateFolderParams` containing the following parameters:
   *
   * - `parentId`: The ID of the folder's parent.
   *
   * - `name`: Name of the folder.
   *
   * - `reuseExisting`: Return existing folder if it exists rather than creating a new one.
   *
   * - `public`: Whether the folder should be publicly visible. By default, inherits the value from parent folder, or in the case of user or collection parentType, defaults to False.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `description`: Description for the folder.
   */
  folderCreateFolderResponse(params: FolderService.FolderCreateFolderParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.reuseExisting != null) __params = __params.set('reuseExisting', params.reuseExisting.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.metadata !== null && typeof params.metadata !== 'undefined') {
      __formData.append('metadata', params.metadata as string | Blob);
    }
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/folder`, __body, {
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
   * @param params The `FolderService.FolderCreateFolderParams` containing the following parameters:
   *
   * - `parentId`: The ID of the folder's parent.
   *
   * - `name`: Name of the folder.
   *
   * - `reuseExisting`: Return existing folder if it exists rather than creating a new one.
   *
   * - `public`: Whether the folder should be publicly visible. By default, inherits the value from parent folder, or in the case of user or collection parentType, defaults to False.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `description`: Description for the folder.
   */
  folderCreateFolder(params: FolderService.FolderCreateFolderParams): __Observable<null> {
    return this.folderCreateFolderResponse(params).pipe(__map(_r => _r.body as null));
  }
  folderListImportedDataResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/registered`, __body, {
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
  folderListImportedData(): __Observable<null> {
    return this.folderListImportedDataResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderDeleteFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `progress`: Whether to record progress on this task.
   */
  folderDeleteFolderResponse(params: FolderService.FolderDeleteFolderParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/folder/${params.id}`, __body, {
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
   * @param params The `FolderService.FolderDeleteFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `progress`: Whether to record progress on this task.
   */
  folderDeleteFolder(params: FolderService.FolderDeleteFolderParams): __Observable<null> {
    return this.folderDeleteFolderResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  folderGetFolderResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${id}`, __body, {
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
  folderGetFolder(id: string): __Observable<null> {
    return this.folderGetFolderResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderUpdateFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: Parent ID for the new parent of this folder.
   *
   * - `name`: Name of the folder.
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `description`: Description for the folder.
   */
  folderUpdateFolderResponse(params: FolderService.FolderUpdateFolderParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;

    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.metadata !== null && typeof params.metadata !== 'undefined') {
      __formData.append('metadata', params.metadata as string | Blob);
    }
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/folder/${params.id}`, __body, {
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
   * @param params The `FolderService.FolderUpdateFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: Parent ID for the new parent of this folder.
   *
   * - `name`: Name of the folder.
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `description`: Description for the folder.
   */
  folderUpdateFolder(params: FolderService.FolderUpdateFolderParams): __Observable<null> {
    return this.folderUpdateFolderResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  folderGetFolderAccessResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${id}/access`, __body, {
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
  folderGetFolderAccess(id: string): __Observable<null> {
    return this.folderGetFolderAccessResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderUpdateFolderAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The JSON-encoded access control list.
   *
   * - `recurse`: Whether the policies should be applied to all subfolders under this folder as well.
   *
   * - `publicFlags`: JSON list of public access flags.
   *
   * - `public`: Whether the folder should be publicly visible.
   *
   * - `progress`: If recurse is set to True, this controls whether progress notifications will be sent.
   */
  folderUpdateFolderAccessResponse(params: FolderService.FolderUpdateFolderAccessParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.access != null) __params = __params.set('access', params.access.toString());
    if (params.recurse != null) __params = __params.set('recurse', params.recurse.toString());
    if (params.publicFlags != null) __params = __params.set('publicFlags', params.publicFlags.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/folder/${params.id}/access`, __body, {
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
   * @param params The `FolderService.FolderUpdateFolderAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The JSON-encoded access control list.
   *
   * - `recurse`: Whether the policies should be applied to all subfolders under this folder as well.
   *
   * - `publicFlags`: JSON list of public access flags.
   *
   * - `public`: Whether the folder should be publicly visible.
   *
   * - `progress`: If recurse is set to True, this controls whether progress notifications will be sent.
   */
  folderUpdateFolderAccess(params: FolderService.FolderUpdateFolderAccessParams): __Observable<null> {
    return this.folderUpdateFolderAccessResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Cleans out all the items and subfolders from under a folder, but does not remove the folder itself.
   * @param params The `FolderService.FolderDeleteContentsParams` containing the following parameters:
   *
   * - `id`: The ID of the folder to clean.
   *
   * - `progress`: Whether to record progress on this task.
   */
  folderDeleteContentsResponse(params: FolderService.FolderDeleteContentsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/folder/${params.id}/contents`, __body, {
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
   * Cleans out all the items and subfolders from under a folder, but does not remove the folder itself.
   * @param params The `FolderService.FolderDeleteContentsParams` containing the following parameters:
   *
   * - `id`: The ID of the folder to clean.
   *
   * - `progress`: Whether to record progress on this task.
   */
  folderDeleteContents(params: FolderService.FolderDeleteContentsParams): __Observable<null> {
    return this.folderDeleteContentsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderCopyFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the original folder.
   *
   * - `public`: Whether the folder should be publicly visible. By default, inherits the value from parent folder, or in the case of user or collection parentType, defaults to False. If 'original', use the value of the original folder.
   *
   * - `progress`: Whether to record progress on this task.
   *
   * - `parentType`: Type of the new folder's parent
   *
   * - `parentId`: The ID of the parent document.
   *
   * - `name`: Name for the new folder.
   *
   * - `description`: Description for the new folder.
   */
  folderCopyFolderResponse(params: FolderService.FolderCopyFolderParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/folder/${params.id}/copy`, __body, {
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
   * @param params The `FolderService.FolderCopyFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the original folder.
   *
   * - `public`: Whether the folder should be publicly visible. By default, inherits the value from parent folder, or in the case of user or collection parentType, defaults to False. If 'original', use the value of the original folder.
   *
   * - `progress`: Whether to record progress on this task.
   *
   * - `parentType`: Type of the new folder's parent
   *
   * - `parentId`: The ID of the parent document.
   *
   * - `name`: Name for the new folder.
   *
   * - `description`: Description for the new folder.
   */
  folderCopyFolder(params: FolderService.FolderCopyFolderParams): __Observable<null> {
    return this.folderCopyFolderResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the folder
   */
  folderGetDataSetResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${id}/dataset`, __body, {
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
   * @param id The ID of the folder
   */
  folderGetDataSet(id: string): __Observable<null> {
    return this.folderGetDataSetResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  folderGetFolderDetailsResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${id}/details`, __body, {
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
  folderGetFolderDetails(id: string): __Observable<null> {
    return this.folderGetFolderDetailsResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderDownloadFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `mimeFilter`: JSON list of MIME types to include.
   */
  folderDownloadFolderResponse(params: FolderService.FolderDownloadFolderParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.mimeFilter != null) __params = __params.set('mimeFilter', params.mimeFilter.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${params.id}/download`, __body, {
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
   * @param params The `FolderService.FolderDownloadFolderParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `mimeFilter`: JSON list of MIME types to include.
   */
  folderDownloadFolder(params: FolderService.FolderDownloadFolderParams): __Observable<null> {
    return this.folderDownloadFolderResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the folder.
   */
  folderListFolderResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${id}/listing`, __body, {
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
  folderListFolder(id: string): __Observable<null> {
    return this.folderListFolderResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FolderService.FolderDeleteMetadataParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `fields`: A JSON list containing the metadata fields to delete
   */
  folderDeleteMetadataResponse(params: FolderService.FolderDeleteMetadataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.fields;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/folder/${params.id}/metadata`, __body, {
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
   * @param params The `FolderService.FolderDeleteMetadataParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `fields`: A JSON list containing the metadata fields to delete
   */
  folderDeleteMetadata(params: FolderService.FolderDeleteMetadataParams): __Observable<null> {
    return this.folderDeleteMetadataResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Set metadata fields to null in order to delete them.
   * @param params The `FolderService.FolderSetMetadataParams` containing the following parameters:
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `id`: The ID of the document.
   *
   * - `allowNull`: Whether "null" is allowed as a metadata value.
   */
  folderSetMetadataResponse(params: FolderService.FolderSetMetadataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.metadata;

    if (params.allowNull != null) __params = __params.set('allowNull', params.allowNull.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/folder/${params.id}/metadata`, __body, {
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
   * @param params The `FolderService.FolderSetMetadataParams` containing the following parameters:
   *
   * - `metadata`: A JSON object containing the metadata keys to add
   *
   * - `id`: The ID of the document.
   *
   * - `allowNull`: Whether "null" is allowed as a metadata value.
   */
  folderSetMetadata(params: FolderService.FolderSetMetadataParams): __Observable<null> {
    return this.folderSetMetadataResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  folderRootpathResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/folder/${id}/rootpath`, __body, {
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
  folderRootpath(id: string): __Observable<null> {
    return this.folderRootpathResponse(id).pipe(__map(_r => _r.body as null));
  }
}

module FolderService {
  /**
   * Parameters for folderFind
   */
  export interface FolderFindParams {
    /**
     * Pass to perform a text search.
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
     * Type of the folder's parent
     */
    parentType?: 'folder' | 'user' | 'collection';

    /**
     * The ID of the folder's parent.
     */
    parentId?: string;

    /**
     * Offset into result set.
     */
    offset?: number;

    /**
     * Pass to lookup a folder by exact name match. Must pass parentType and parentId as well when using this.
     */
    name?: string;

    /**
     * Result set size limit.
     */
    limit?: number;
  }

  /**
   * Parameters for folderCreateFolder
   */
  export interface FolderCreateFolderParams {
    /**
     * The ID of the folder's parent.
     */
    parentId: string;

    /**
     * Name of the folder.
     */
    name: string;

    /**
     * Return existing folder if it exists rather than creating a new one.
     */
    reuseExisting?: boolean;

    /**
     * Whether the folder should be publicly visible. By default, inherits the value from parent folder, or in the case of user or collection parentType, defaults to False.
     */
    public?: boolean;

    /**
     * Type of the folder's parent
     */
    parentType?: 'folder' | 'user' | 'collection';

    /**
     * A JSON object containing the metadata keys to add
     */
    metadata?: string;

    /**
     * Description for the folder.
     */
    description?: string;
  }

  /**
   * Parameters for folderDeleteFolder
   */
  export interface FolderDeleteFolderParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;
  }

  /**
   * Parameters for folderUpdateFolder
   */
  export interface FolderUpdateFolderParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Type of the folder's parent
     */
    parentType?: 'folder' | 'user' | 'collection';

    /**
     * Parent ID for the new parent of this folder.
     */
    parentId?: string;

    /**
     * Name of the folder.
     */
    name?: string;

    /**
     * A JSON object containing the metadata keys to add
     */
    metadata?: string;

    /**
     * Description for the folder.
     */
    description?: string;
  }

  /**
   * Parameters for folderUpdateFolderAccess
   */
  export interface FolderUpdateFolderAccessParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The JSON-encoded access control list.
     */
    access: string;

    /**
     * Whether the policies should be applied to all subfolders under this folder as well.
     */
    recurse?: boolean;

    /**
     * JSON list of public access flags.
     */
    publicFlags?: string;

    /**
     * Whether the folder should be publicly visible.
     */
    public?: boolean;

    /**
     * If recurse is set to True, this controls whether progress notifications will be sent.
     */
    progress?: boolean;
  }

  /**
   * Parameters for folderDeleteContents
   */
  export interface FolderDeleteContentsParams {
    /**
     * The ID of the folder to clean.
     */
    id: string;

    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;
  }

  /**
   * Parameters for folderCopyFolder
   */
  export interface FolderCopyFolderParams {
    /**
     * The ID of the original folder.
     */
    id: string;

    /**
     * Whether the folder should be publicly visible. By default, inherits the value from parent folder, or in the case of user or collection parentType, defaults to False. If 'original', use the value of the original folder.
     */
    public?: 'true' | 'false' | 'original';

    /**
     * Whether to record progress on this task.
     */
    progress?: boolean;

    /**
     * Type of the new folder's parent
     */
    parentType?: 'folder' | 'user' | 'collection';

    /**
     * The ID of the parent document.
     */
    parentId?: string;

    /**
     * Name for the new folder.
     */
    name?: string;

    /**
     * Description for the new folder.
     */
    description?: string;
  }

  /**
   * Parameters for folderDownloadFolder
   */
  export interface FolderDownloadFolderParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * JSON list of MIME types to include.
     */
    mimeFilter?: string;
  }

  /**
   * Parameters for folderDeleteMetadata
   */
  export interface FolderDeleteMetadataParams {
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
   * Parameters for folderSetMetadata
   */
  export interface FolderSetMetadataParams {
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

export { FolderService };
