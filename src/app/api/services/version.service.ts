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
class VersionService extends __BaseService {
  static readonly versionCreateVersionPath = '/version';
  static readonly versionGetVersionPath = '/version/{id}';
  static readonly versionDeleteVersionPath = '/version/{id}';
  static readonly versionListVersionsPath = '/version/list';

  static readonly versionGetRootPath = '/version/{id}/getRoot';

  // TBD
  static readonly versionGetDataSetPath = '/version/{id}/dataSet';
  static readonly versionGetRenameVersionPath = '/version/{id}/rename';
  static readonly versionGetExistsPath = '/version/{id}/exists';
  static readonly versionGetLatestPath = '/version/{id}/latest';

  // Admin-only
  // static readonly versionGetClearVersionsPath = '/version/{id}/clear';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }
  versionCreateVersionResponse(params: VersionService.VersionCreateVersionParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.taleId != null) __params = __params.set('taleId', params.taleId.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.force != null) __params = __params.set('force', params.force.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + VersionService.versionCreateVersionPath, __body, {
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
  versionCreateVersion(params: VersionService.VersionCreateVersionParams): __Observable<null> {
    return this.versionCreateVersionResponse(params).pipe(__map(_r => _r.body as null));
  }

  versionGetRootResponse(taleId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (taleId != null) __params = __params.set('taleId', taleId.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/version/getRoot`, __body, {
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
  versionGetRoot(taleId: string): __Observable<null> {
    return this.versionGetRootResponse(taleId).pipe(__map(_r => _r.body as null));
  }

  versionGetVersionResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/version/${id}`, __body, {
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
  versionGetVersion(id: string): __Observable<null> {
    return this.versionGetVersionResponse(id).pipe(__map(_r => _r.body as null));
  }

  versionDeleteVersionResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/version/${id}`, __body, {
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
  versionDeleteVersion(id: string): __Observable<null> {
    return this.versionDeleteVersionResponse(id).pipe(__map(_r => _r.body as null));
  }

  versionListVersionsResponse(params: VersionService.VersionListVersionsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.rootId != null) __params = __params.set('rootId', params.rootId.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.sortDir != null) __params = __params.set('sortDir', params.sortDir.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + '/version/list', __body, {
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
  versionListVersions(params: VersionService.VersionListVersionsParams): __Observable<null> {
    return this.versionListVersionsResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module VersionService {
  export interface VersionCreateVersionParams {
    taleId: string;
    name?: string;
    force?: boolean;
  }

  export interface VersionListVersionsParams {
    rootId: string;
    limit?: number;
    offset?: number;
    sort?: string;
    sortDir?: number;
  }
}

export { VersionService };
