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
class HomedirpassService extends __BaseService {
  static readonly GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8GeneratePasswordPath = '/homedirpass/generate';
  static readonly GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8SetPasswordPath = '/homedirpass/set';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }
  GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8GeneratePasswordResponse(): __Observable<
    __StrictHttpResponse<null>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/homedirpass/generate`, __body, {
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
  GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8GeneratePassword(): __Observable<null> {
    return this.GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8GeneratePasswordResponse().pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param password The password to set.
   */
  GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8SetPasswordResponse(
    password: string
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (password !== null && typeof password !== 'undefined') {
      __formData.append('password', password as string | Blob);
    }
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/homedirpass/set`, __body, {
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
   * @param password The password to set.
   */
  GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8SetPassword(password: string): __Observable<null> {
    return this.GirderPluginsWtHomeDirResourcesHomedirpassHomedirpassObjectAt0x7fdc75287ba8SetPasswordResponse(password).pipe(
      __map(_r => _r.body as null)
    );
  }
}

module HomedirpassService {}

export { HomedirpassService };
