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
class WorkerService extends __BaseService {
  static readonly workerGetWorkerStatusPath = '/worker/status';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Return -1 if the broker is inaccessible.
   */
  workerGetWorkerStatusResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/worker/status`, __body, {
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
   * Return -1 if the broker is inaccessible.
   */
  workerGetWorkerStatus(): __Observable<null> {
    return this.workerGetWorkerStatusResponse().pipe(__map(_r => _r.body as null));
  }
}

module WorkerService {}

export { WorkerService };
