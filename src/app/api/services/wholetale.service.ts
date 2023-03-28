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
class WholetaleService extends __BaseService {
  static readonly wholetaleGetWholetaleInfoPath = '/wholetale';
  static readonly wholetaleRegenerateCitationsPath = '/wholetale/citations';
  static readonly wholetaleGetWholetaleSettingsPath = '/wholetale/settings';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }
  wholetaleGetWholetaleInfoResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/wholetale`, __body, {
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
  wholetaleGetWholetaleInfo(): __Observable<null> {
    return this.wholetaleGetWholetaleInfoResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * Hopefully DataCite will still love us, after we hammer their API
   */
  wholetaleRegenerateCitationsResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/wholetale/citations`, __body, {
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
   * Hopefully DataCite will still love us, after we hammer their API
   */
  wholetaleRegenerateCitations(): __Observable<null> {
    return this.wholetaleRegenerateCitationsResponse().pipe(__map(_r => _r.body as null));
  }

  wholetaleGetSettingsResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/wholetale/settings`, __body, {
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

  wholetaleGetSettings(): __Observable<null> {
    return this.wholetaleGetSettingsResponse().pipe(__map(_r => _r.body as null));
  }
}

module WholetaleService {}

export { WholetaleService };
