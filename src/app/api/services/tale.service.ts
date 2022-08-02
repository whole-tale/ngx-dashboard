/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { Tale } from '../models/tale';
@Injectable({
  providedIn: 'root',
})
class TaleService extends __BaseService {
  static readonly taleListTalesPath = '/tale';
  static readonly taleCreateTalePath = '/tale';
  static readonly taleCreateTaleFromUrlPath = '/tale/import';
  static readonly taleDeleteTalePath = '/tale/{id}';
  static readonly taleGetTalePath = '/tale/{id}';
  static readonly taleUpdateTalePath = '/tale/{id}';
  static readonly taleGetTaleAccessPath = '/tale/{id}/access';
  static readonly taleUpdateTaleAccessPath = '/tale/{id}/access';
  static readonly taleBuildImagePath = '/tale/{id}/build';
  static readonly taleCopyTalePath = '/tale/{id}/copy';
  static readonly taleExportTalePath = '/tale/{id}/export';
  static readonly taleGenerateManifestPath = '/tale/{id}/manifest';
  static readonly talePublishTalePath = '/tale/{id}/publish';
  static readonly taleRestoreVersionPath = '/tale/{id}/restore';
  static readonly taleUpdateGitPath = '/tale/{id}/git';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `TaleService.TaleListTalesParams` containing the following parameters:
   *
   * - `userId`: The ID of the tale's creator.
   *
   * - `text`: Perform a full text search for Tale with a matching title or description.
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
   *
   * - `imageId`: The ID of the tale's image.
   */
  taleListTalesResponse(params: TaleService.TaleListTalesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.level != null) __params = __params.set('level', params.level.toString());
    if (params.imageId != null) __params = __params.set('imageId', params.imageId.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/tale`, __body, {
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
   * @param params The `TaleService.TaleListTalesParams` containing the following parameters:
   *
   * - `userId`: The ID of the tale's creator.
   *
   * - `text`: Perform a full text search for Tale with a matching title or description.
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
   *
   * - `imageId`: The ID of the tale's image.
   */
  taleListTales(params: TaleService.TaleListTalesParams): __Observable<null> {
    return this.taleListTalesResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param tale A new tale
   */
  taleCreateTaleResponse(tale: Tale): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = tale;
    let req = new HttpRequest<any>('POST', this.rootUrl + `/tale`, __body, {
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
   * @param tale A new tale
   */
  taleCreateTale(tale: Tale): __Observable<null> {
    return this.taleCreateTaleResponse(tale).pipe(__map((_r) => _r.body as null));
  }

  /**
   * Currently, this task only handles importing raw data. A serialized Tale can be sent as the body of the request using an appropriate content-type and with the other parameters as part of the query string. The file will be stored in a temporary space. However, it is not currently being processed in any way.
   * @param params The `TaleService.TaleCreateTaleFromUrlParams` containing the following parameters:
   *
   * - `url`: External dataset identifier.
   *
   * - `taleKwargs`: Optional keyword arguments passed to POST /tale
   *
   * - `spawn`: If false, create only Tale object without a corresponding Instance.
   *
   * - `lookupKwargs`: Optional keyword arguments passed to GET /repository/lookup
   *
   * - `imageId`: The ID of the tale's image.
   *
   * - `git`: If True, assume that url is a git repo that needs to be cloned to the workspace.
   *
   * - `asTale`: If True, assume that external dataset is a Tale.
   */
  taleCreateTaleFromUrlResponse(params: TaleService.TaleCreateTaleFromUrlParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.git != null) __params = __params.set('git', params.git.toString());
    if (params.url != null) __params = __params.set('url', params.url.toString());
    if (params.taleKwargs != null) __params = __params.set('taleKwargs', JSON.stringify(params.taleKwargs));
    if (params.spawn != null) __params = __params.set('spawn', params.spawn.toString());
    if (params.lookupKwargs != null) __params = __params.set('lookupKwargs', JSON.stringify(params.lookupKwargs));
    if (params.imageId != null) __params = __params.set('imageId', params.imageId.toString());
    if (params.asTale != null) __params = __params.set('asTale', params.asTale.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/tale/import`, __body, {
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
   * Currently, this task only handles importing raw data. A serialized Tale can be sent as the body of the request using an appropriate content-type and with the other parameters as part of the query string. The file will be stored in a temporary space. However, it is not currently being processed in any way.
   * @param params The `TaleService.TaleCreateTaleFromUrlParams` containing the following parameters:
   *
   * - `url`: External dataset identifier.
   *
   * - `taleKwargs`: Optional keyword arguments passed to POST /tale
   *
   * - `spawn`: If false, create only Tale object without a corresponding Instance.
   *
   * - `lookupKwargs`: Optional keyword arguments passed to GET /repository/lookup
   *
   * - `imageId`: The ID of the tale's image.
   *
   * - `git`: If True, assume that url is a git repo that needs to be cloned to the workspace.
   *
   * - `asTale`: If True, assume that external dataset is a Tale.
   */
  taleCreateTaleFromUrl(params: TaleService.TaleCreateTaleFromUrlParams): __Observable<null> {
    return this.taleCreateTaleFromUrlResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `TaleService.TaleDeleteTaleParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `progress`: Whether to record progress on this task.
   */
  taleDeleteTaleResponse(params: TaleService.TaleDeleteTaleParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/tale/${params.id}`, __body, {
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
   * @param params The `TaleService.TaleDeleteTaleParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `progress`: Whether to record progress on this task.
   */
  taleDeleteTale(params: TaleService.TaleDeleteTaleParams): __Observable<null> {
    return this.taleDeleteTaleResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  taleGetTaleResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/tale/${id}`, __body, {
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
  taleGetTale(id: string): __Observable<null> {
    return this.taleGetTaleResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `TaleService.TaleUpdateTaleParams` containing the following parameters:
   *
   * - `tale`: Updated tale
   *
   * - `id`: The ID of the document.
   */
  taleUpdateTaleResponse(params: TaleService.TaleUpdateTaleParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.tale;

    let req = new HttpRequest<any>('PUT', this.rootUrl + `/tale/${params.id}`, __body, {
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
   * @param params The `TaleService.TaleUpdateTaleParams` containing the following parameters:
   *
   * - `tale`: Updated tale
   *
   * - `id`: The ID of the document.
   */
  taleUpdateTale(params: TaleService.TaleUpdateTaleParams): __Observable<null> {
    return this.taleUpdateTaleResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  taleGetTaleAccessResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/tale/${id}/access`, __body, {
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
  taleGetTaleAccess(id: string): __Observable<null> {
    return this.taleGetTaleAccessResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `TaleService.TaleUpdateTaleAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The JSON-encoded access control list.
   *
   * - `publicFlags`: JSON list of public access flags.
   *
   * - `public`: Whether the tale should be publicly visible.
   */
  taleUpdateTaleAccessResponse(params: TaleService.TaleUpdateTaleAccessParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.access != null) __params = __params.set('access', params.access.toString());
    if (params.publicFlags != null) __params = __params.set('publicFlags', params.publicFlags.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/tale/${params.id}/access`, __body, {
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
   * @param params The `TaleService.TaleUpdateTaleAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The JSON-encoded access control list.
   *
   * - `publicFlags`: JSON list of public access flags.
   *
   * - `public`: Whether the tale should be publicly visible.
   */
  taleUpdateTaleAccess(params: TaleService.TaleUpdateTaleAccessParams): __Observable<null> {
    return this.taleUpdateTaleAccessResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `TaleService.TaleBuildImageParams` containing the following parameters:
   *
   * - `id`: The ID of the Tale.
   *
   * - `force`: If true, force build regardless of workspace changes
   */
  taleBuildImageResponse(params: TaleService.TaleBuildImageParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.force != null) __params = __params.set('force', params.force.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/tale/${params.id}/build`, __body, {
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
   * @param params The `TaleService.TaleBuildImageParams` containing the following parameters:
   *
   * - `id`: The ID of the Tale.
   *
   * - `force`: If true, force build regardless of workspace changes
   */
  taleBuildImage(params: TaleService.TaleBuildImageParams): __Observable<null> {
    return this.taleBuildImageResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   @param id The ID of the Tale to copy.
   @param versionId (optional) the ID of the Tale Version to copy. If set, only current version will be copied.
   @param shallow If true, copy only current state. If versionId is set, copy only current Version.
   */
  taleCopyTaleResponse(id: string, versionId?: string, shallow = false): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    const url = this.rootUrl + (versionId ? `/tale/${id}/copy?versionId=${versionId}&shallow=${shallow}` : `/tale/${id}/copy`);
    let req = new HttpRequest<any>('POST', url, __body, {
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
   * @param id The ID of the Tale to copy.
   * @param versionId (optional) the ID of the Tale Version to copy. If set, only current version will be copied.
   * @param shallow If true, copy only current state. If versionId is set, copy only current Version.
   */
  taleCopyTale(id: string, versionId?: string, shallow = false): __Observable<null> {
    return this.taleCopyTaleResponse(id, versionId, shallow).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `TaleService.TaleExportTaleParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `taleFormat`: Format of the exported Tale
   */
  taleExportTaleResponse(params: TaleService.TaleExportTaleParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.taleFormat != null) __params = __params.set('taleFormat', params.taleFormat.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/tale/${params.id}/export`, __body, {
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
   * @param params The `TaleService.TaleExportTaleParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `taleFormat`: Format of the exported Tale
   */
  taleExportTale(params: TaleService.TaleExportTaleParams): __Observable<null> {
    return this.taleExportTaleResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param params The `TaleService.TaleGenerateManifestParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `expandFolders`: If True, folders in Tale's dataSet are recursively expanded to items in the 'aggregates' section
   */
  taleGenerateManifestResponse(params: TaleService.TaleGenerateManifestParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.expandFolders != null) __params = __params.set('expandFolders', params.expandFolders.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/tale/${params.id}/manifest`, __body, {
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
   * @param params The `TaleService.TaleGenerateManifestParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `expandFolders`: If True, folders in Tale's dataSet are recursively expanded to items in the 'aggregates' section
   */
  taleGenerateManifest(params: TaleService.TaleGenerateManifestParams): __Observable<null> {
    return this.taleGenerateManifestResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * Publish a Tale to the target Repository.
   * @param params The `TaleService.TalePublishTaleParams` containing the following parameters:
   *
   * - `id`: The ID of the tale to publish.
   *
   * - `repository`: The repository URL of the publish destination.
   */
  talePublishTaleResponse(params: TaleService.TalePublishTaleParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.repository != null) __params = __params.set('repository', params.repository.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/tale/${params.id}/publish`, __body, {
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
   * Publish a Tale to the target Repository.
   * @param params The `TaleService.TalePublishTaleParams` containing the following parameters:
   *
   * - `id`: The ID of the tale to publish.
   *
   * - `repository`: The repository URL of the publish destination.
   */
  talePublishTale(params: TaleService.TalePublishTaleParams): __Observable<null> {
    return this.talePublishTaleResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * - `id`: The ID of the Tale to modify.
   *
   * - `url`: The URL of the Git repo to import.
   */
  taleUpdateGitResponse(id: string, url: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (url != null) __params = __params.set('url', url.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/tale/${id}/git`, __body, {
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
   * - `id`: The ID of the Tale to modify.
   *
   * - `url`: The URL of the Git repo to import.
   */
  taleUpdateGit(id: string, url: string): __Observable<null> {
    return this.taleUpdateGitResponse(id, url).pipe(__map((_r) => _r.body as null));
  }

  taleRestoreVersionResponse(id: string, versionId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (versionId != null) __params = __params.set('versionId', versionId.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/tale/${id}/restore`, __body, {
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

  taleRestoreVersion(id: string, versionId: string): __Observable<null> {
    return this.taleRestoreVersionResponse(id, versionId).pipe(__map((_r) => _r.body as null));
  }
  taleViewRestoredVersionResponse(id: string, versionId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    if (versionId != null) __params = __params.set('versionId', versionId.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/tale/${id}/restore`, {
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

  taleViewRestoredVersion(id: string, versionId: string): __Observable<null> {
    return this.taleViewRestoredVersionResponse(id, versionId).pipe(__map((_r) => _r.body as null));
  }
}

module TaleService {
  /**
   * Parameters for taleListTales
   */
  export interface TaleListTalesParams {
    /**
     * The ID of the tale's creator.
     */
    userId?: string;

    /**
     * Perform a full text search for Tale with a matching title or description.
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

    /**
     * The minimum access level to the Tale.
     */
    level?: -1 | 0 | 1 | 2;

    /**
     * The ID of the tale's image.
     */
    imageId?: string;
  }

  /**
   * Parameters for taleCreateTaleFromUrl
   */
  export interface TaleCreateTaleFromUrlParams {
    /**
     * External dataset identifier or git repo.
     */
    url?: string;

    /**
     * Optional keyword arguments passed to POST /tale
     */
    taleKwargs?: {};

    /**
     * If false, create only Tale object without a corresponding Instance.
     */
    spawn?: boolean;

    /**
     * Optional keyword arguments passed to GET /repository/lookup
     */
    lookupKwargs?: {};

    /**
     * The ID of the tale's image.
     */
    imageId?: string;

    /**
     * If True, assume that url is a git repo that needs to be cloned to the workspace.
     */
    git?: boolean;

    /**
     * If True, assume that external dataset is a Tale.
     */
    asTale?: boolean;
  }

  /**
   * Parameters for taleDeleteTale
   */
  export interface TaleDeleteTaleParams {
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
   * Parameters for taleUpdateTale
   */
  export interface TaleUpdateTaleParams {
    /**
     * Updated tale
     */
    tale: Tale;

    /**
     * The ID of the document.
     */
    id: string;
  }

  /**
   * Parameters for taleUpdateTaleAccess
   */
  export interface TaleUpdateTaleAccessParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The JSON-encoded access control list.
     */
    access: string;

    /**
     * JSON list of public access flags.
     */
    publicFlags?: string;

    /**
     * Whether the tale should be publicly visible.
     */
    public?: boolean;
  }

  /**
   * Parameters for taleBuildImage
   */
  export interface TaleBuildImageParams {
    /**
     * The ID of the Tale.
     */
    id: string;

    /**
     * If true, force build regardless of workspace changes
     */
    force?: boolean;
  }

  /**
   * Parameters for taleExportTale
   */
  export interface TaleExportTaleParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Format of the exported Tale
     */
    taleFormat?: 'bagit' | 'native';
  }

  /**
   * Parameters for taleGenerateManifest
   */
  export interface TaleGenerateManifestParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * If True, folders in Tale's dataSet are recursively expanded to items in the 'aggregates' section
     */
    expandFolders?: boolean;
  }

  /**
   * Parameters for talePublishTale
   */
  export interface TalePublishTaleParams {
    /**
     * The ID of the Tale that should be published
     */
    id: string;

    /**
     * Repository URL to which the Tale should be published
     */
    repository: string;
  }
}

export { TaleService };
