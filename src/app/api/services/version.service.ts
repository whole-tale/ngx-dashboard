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
  static readonly versionGetDataSetPath = '/version/{id}/dataSet';
  static readonly versionGetRenameVersionPath = '/version/{id}/rename';
  static readonly versionGetClearVersionsPath = '/version/{id}/clear';
  static readonly versionGetExistsPath = '/version/{id}/exists';
  static readonly versionGetRootPath = '/version/{id}/getRoot';
  static readonly versionGetLatestPath = '/version/{id}/latest';
  static readonly versionListVersionsPath = '/version/list';

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
}

module VersionService {
  export interface VersionCreateVersionParams {
    taleId: string;
    name?: string;
    force?: boolean;
  }
}

export { VersionService };
