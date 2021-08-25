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
class RunService extends __BaseService {
  static readonly runListRunsPath = '/run';
  static readonly runCreateRunPath = '/run';
  static readonly runGetRunPath = '/run/{id}';
  static readonly runPutRenameRunPath = '/run/{id}';
  static readonly runDeleteRunPath = '/run/{id}';

  static readonly runStartRunPath = '/run/{id}/start';
  static readonly runGetRunStatusPath = '/run/{id}/status';
  static readonly runPutRunStatusPath = '/run/{id}/status';

  // TODO: Not implemented
  static readonly runExistsRunPath = '/run/{id}/exists';

  // Admin only function to remove all existing runs (use Swagger UI)
  // static readonly runClearAllRunsPath = '/run/clear';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }
  runCreateRunResponse(params: RunService.RunCreateRunParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.versionId != null) __params = __params.set('versionId', params.versionId.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());

    let req = new HttpRequest<any>('POST', this.rootUrl + RunService.runCreateRunPath, __body, {
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
  runCreateRun(params: RunService.RunCreateRunParams): __Observable<null> {
    return this.runCreateRunResponse(params).pipe(__map((_r) => _r.body as null));
  }

  runGetRunResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/run/${id}`, __body, {
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
  runGetRun(id: string): __Observable<null> {
    return this.runGetRunResponse(id).pipe(__map((_r) => _r.body as null));
  }

  runDeleteRunResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/run/${id}`, __body, {
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
  runDeleteRun(id: string): __Observable<null> {
    return this.runDeleteRunResponse(id).pipe(__map((_r) => _r.body as null));
  }

  runListRunsResponse(params: RunService.RunListRunsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.taleId != null) __params = __params.set('taleId', params.taleId.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.sortDir != null) __params = __params.set('sortDir', params.sortDir.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + '/run', __body, {
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
  runListRuns(params: RunService.RunListRunsParams): __Observable<null> {
    return this.runListRunsResponse(params).pipe(__map((_r) => _r.body as null));
  }

  runPutRenameRunResponse(id: string, name: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (id != null) __params = __params.set('id', id.toString());
    if (name != null) __params = __params.set('name', name.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/run/${id}`, __body, {
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
  runPutRenameRun(id: string, name: string): __Observable<null> {
    return this.runPutRenameRunResponse(id, name).pipe(__map((_r) => _r.body as null));
  }

  runStartRunResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (id != null) __params = __params.set('id', id.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/run/${id}/start`, __body, {
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
  runStartRun(id: string): __Observable<null> {
    return this.runStartRunResponse(id).pipe(__map((_r) => _r.body as null));
  }

  runGetRunStatusResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (id != null) __params = __params.set('id', id.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/run/${id}/status`, __body, {
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
  runGetRunStatus(id: string): __Observable<null> {
    return this.runGetRunStatusResponse(id).pipe(__map((_r) => _r.body as null));
  }

  runUpdateRunStatusResponse(id: string, status: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (id != null) __params = __params.set('status', status.toString());
    if (id != null) __params = __params.set('id', id.toString());
    let req = new HttpRequest<any>('PATCH', this.rootUrl + `/run/${id}/status`, __body, {
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
  runUpdateRunStatus(id: string, status: number): __Observable<null> {
    return this.runUpdateRunStatusResponse(id, status).pipe(__map((_r) => _r.body as null));
  }
}

module RunService {
  export interface RunCreateRunParams {
    versionId: string;
    name?: string;
  }

  export interface RunListRunsParams {
    taleId: string;
    limit?: number;
    offset?: number;
    sort?: string;
    sortDir?: number;
  }
}

export { RunService };
