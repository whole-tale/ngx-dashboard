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
class IntegrationService extends __BaseService {
  static readonly integrationDataoneDataImportPath = '/integration/dataone';
  static readonly integrationDataverseExternalToolsPath = '/integration/dataverse';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * apiToken is currently ignored.
   * @param params The `IntegrationService.IntegrationDataoneDataImportParams` containing the following parameters:
   *
   * - `uri`: The URI of the dataset. This cna be the landing page, pid, or doi.
   *
   * - `title`: The Dataverse database ID of a file the external tool has been launched on.
   *
   * - `environment`: The environment that should be selected.
   *
   * - `apiToken`: The DataONE JWT of the user importing the data, if available.
   *
   * - `api`: An optional API endpoint that should be used to find the dataset.
   */
  integrationDataoneDataImportResponse(
    params: IntegrationService.IntegrationDataoneDataImportParams
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.uri != null) __params = __params.set('uri', params.uri.toString());
    if (params.title != null) __params = __params.set('title', params.title.toString());
    if (params.environment != null) __params = __params.set('environment', params.environment.toString());
    if (params.apiToken != null) __params = __params.set('apiToken', params.apiToken.toString());
    if (params.api != null) __params = __params.set('api', params.api.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/integration/dataone`, __body, {
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
   * apiToken is currently ignored.
   * @param params The `IntegrationService.IntegrationDataoneDataImportParams` containing the following parameters:
   *
   * - `uri`: The URI of the dataset. This cna be the landing page, pid, or doi.
   *
   * - `title`: The Dataverse database ID of a file the external tool has been launched on.
   *
   * - `environment`: The environment that should be selected.
   *
   * - `apiToken`: The DataONE JWT of the user importing the data, if available.
   *
   * - `api`: An optional API endpoint that should be used to find the dataset.
   */
  integrationDataoneDataImport(params: IntegrationService.IntegrationDataoneDataImportParams): __Observable<null> {
    return this.integrationDataoneDataImportResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * apiToken is currently ignored.
   * @param params The `IntegrationService.IntegrationDataverseExternalToolsParams` containing the following parameters:
   *
   * - `siteUrl`: The URL of the Dataverse installation that hosts the file with the fileId above
   *
   * - `fileId`: The Dataverse database ID of a file the external tool has been launched on.
   *
   * - `fullDataset`: If True, imports the full dataset that contains the file defined by fileId.
   *
   * - `apiToken`: The Dataverse API token of the user launching the external tool, if available.
   */
  integrationDataverseExternalToolsResponse(
    params: IntegrationService.IntegrationDataverseExternalToolsParams
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.siteUrl != null) __params = __params.set('siteUrl', params.siteUrl.toString());
    if (params.fileId != null) __params = __params.set('fileId', params.fileId.toString());
    if (params.fullDataset != null) __params = __params.set('fullDataset', params.fullDataset.toString());
    if (params.apiToken != null) __params = __params.set('apiToken', params.apiToken.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/integration/dataverse`, __body, {
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
   * apiToken is currently ignored.
   * @param params The `IntegrationService.IntegrationDataverseExternalToolsParams` containing the following parameters:
   *
   * - `siteUrl`: The URL of the Dataverse installation that hosts the file with the fileId above
   *
   * - `fileId`: The Dataverse database ID of a file the external tool has been launched on.
   *
   * - `fullDataset`: If True, imports the full dataset that contains the file defined by fileId.
   *
   * - `apiToken`: The Dataverse API token of the user launching the external tool, if available.
   */
  integrationDataverseExternalTools(params: IntegrationService.IntegrationDataverseExternalToolsParams): __Observable<null> {
    return this.integrationDataverseExternalToolsResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module IntegrationService {
  /**
   * Parameters for integrationDataoneDataImport
   */
  export interface IntegrationDataoneDataImportParams {
    /**
     * The URI of the dataset. This cna be the landing page, pid, or doi.
     */
    uri: string;

    /**
     * The Dataverse database ID of a file the external tool has been launched on.
     */
    title?: string;

    /**
     * The environment that should be selected.
     */
    environment?: string;

    /**
     * The DataONE JWT of the user importing the data, if available.
     */
    apiToken?: string;

    /**
     * An optional API endpoint that should be used to find the dataset.
     */
    api?: string;
  }

  /**
   * Parameters for integrationDataverseExternalTools
   */
  export interface IntegrationDataverseExternalToolsParams {
    /**
     * The URL of the Dataverse installation that hosts the file with the fileId above
     */
    siteUrl: string;

    /**
     * The Dataverse database ID of a file the external tool has been launched on.
     */
    fileId: string;

    /**
     * If True, imports the full dataset that contains the file defined by fileId.
     */
    fullDataset?: boolean;

    /**
     * The Dataverse API token of the user launching the external tool, if available.
     */
    apiToken?: string;
  }
}

export { IntegrationService };
