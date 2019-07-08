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
class LicenseService extends __BaseService {
  static readonly licenseGetLicensesPath = '/license';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * This endpoint returns a list of all of the Whole Tale supported licenses
   */
  licenseGetLicensesResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/license`, __body, {
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
   * This endpoint returns a list of all of the Whole Tale supported licenses
   */
  licenseGetLicenses(): __Observable<null> {
    return this.licenseGetLicensesResponse().pipe(__map(_r => _r.body as null));
  }
}

module LicenseService {}

export { LicenseService };
