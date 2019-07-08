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
class RepositoryService extends __BaseService {
  static readonly repositoryListFilesPath = '/repository/listFiles';
  static readonly repositoryLookupDataPath = '/repository/lookup';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Given a list of external data identifiers, returns a list of files inside along with their sizes
   * @param params The `RepositoryService.RepositoryListFilesParams` containing the following parameters:
   *
   * - `dataId`: List of external datasets identificators.
   *
   * - `base_url`: The member node base url. This can be used to search datasets from custom networks ,such as the DataONE development network.
   */
  repositoryListFilesResponse(params: RepositoryService.RepositoryListFilesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.dataId != null) __params = __params.set('dataId', params.dataId.toString());
    if (params.baseUrl != null) __params = __params.set('base_url', params.baseUrl.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/repository/listFiles`, __body, {
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
   * Given a list of external data identifiers, returns a list of files inside along with their sizes
   * @param params The `RepositoryService.RepositoryListFilesParams` containing the following parameters:
   *
   * - `dataId`: List of external datasets identificators.
   *
   * - `base_url`: The member node base url. This can be used to search datasets from custom networks ,such as the DataONE development network.
   */
  repositoryListFiles(params: RepositoryService.RepositoryListFilesParams): __Observable<null> {
    return this.repositoryListFilesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * Given a list of external data identifiers, returns mapping to specific repository along with a basic metadata, such as size, name.
   * @param params The `RepositoryService.RepositoryLookupDataParams` containing the following parameters:
   *
   * - `dataId`: List of external datasets identificators.
   *
   * - `base_url`: The node endpoint url. This can be used to register datasets from custom networks, such as the DataONE development network. This can be passed in as an ordinary string. Examples include https://dev.nceas.ucsb.edu/knb/d1/mn/v2 and https://cn.dataone.org/cn/v2
   */
  repositoryLookupDataResponse(params: RepositoryService.RepositoryLookupDataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.dataId != null) __params = __params.set('dataId', params.dataId.toString());
    if (params.baseUrl != null) __params = __params.set('base_url', params.baseUrl.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/repository/lookup`, __body, {
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
   * Given a list of external data identifiers, returns mapping to specific repository along with a basic metadata, such as size, name.
   * @param params The `RepositoryService.RepositoryLookupDataParams` containing the following parameters:
   *
   * - `dataId`: List of external datasets identificators.
   *
   * - `base_url`: The node endpoint url. This can be used to register datasets from custom networks, such as the DataONE development network. This can be passed in as an ordinary string. Examples include https://dev.nceas.ucsb.edu/knb/d1/mn/v2 and https://cn.dataone.org/cn/v2
   */
  repositoryLookupData(params: RepositoryService.RepositoryLookupDataParams): __Observable<null> {
    return this.repositoryLookupDataResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module RepositoryService {
  /**
   * Parameters for repositoryListFiles
   */
  export interface RepositoryListFilesParams {
    /**
     * List of external datasets identificators.
     */
    dataId: string;

    /**
     * The member node base url. This can be used to search datasets from custom networks ,such as the DataONE development network.
     */
    baseUrl?: string;
  }

  /**
   * Parameters for repositoryLookupData
   */
  export interface RepositoryLookupDataParams {
    /**
     * List of external datasets identificators.
     */
    dataId: string;

    /**
     * The node endpoint url. This can be used to register datasets from custom networks, such as the DataONE development network. This can be passed in as an ordinary string. Examples include https://dev.nceas.ucsb.edu/knb/d1/mn/v2 and https://cn.dataone.org/cn/v2
     */
    baseUrl?: string;
  }
}

export { RepositoryService };
