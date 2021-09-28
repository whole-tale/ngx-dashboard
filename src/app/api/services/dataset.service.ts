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
class DatasetService extends __BaseService {
  static readonly datasetListDatasetsPath = '/dataset';
  static readonly datasetImportDataPath = '/dataset/register';
  static readonly datasetImportBagDataPath = '/dataset/importBag';
  static readonly datasetDeleteUserDatasetPath = '/dataset/{id}';
  static readonly datasetGetDatasetPath = '/dataset/{id}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `DatasetService.DatasetListDatasetsParams` containing the following parameters:
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `myData`: If True, filters results to datasets registered by the user.Defaults to False.
   *
   * - `limit`: Result set size limit.
   *
   * - `identifiers`: Filter datasets by an identifier
   */
  datasetListDatasetsResponse(params: DatasetService.DatasetListDatasetsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.myData != null) __params = __params.set('myData', params.myData.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.identifiers != null) __params = __params.set('identifiers', params.identifiers.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/dataset`, __body, {
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
   * @param params The `DatasetService.DatasetListDatasetsParams` containing the following parameters:
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `myData`: If True, filters results to datasets registered by the user.Defaults to False.
   *
   * - `limit`: Result set size limit.
   *
   * - `identifiers`: Filter datasets by an identifier
   */
  datasetListDatasets(params: DatasetService.DatasetListDatasetsParams): __Observable<null> {
    return this.datasetListDatasetsResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * Imports a BDBag-format file. Files that exist in the bag are imported directly, whereas references are only
   * stored by reference and fetched on-demand.
   * @param params The `DatasetService.DatasetImportBagDataParams` containing the following parameters:
   *
   * - `public`: Whether the folder should be publicly visible. Defaults to False.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: Parent ID for the new parent of this folder.
   *
   * - `bagFile`: The file to upload
   */
  datasetImportBagDataResponse(params: DatasetService.DatasetImportBagDataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = params.bagFile;
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + DatasetService.datasetImportBagDataPath, __body, {
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
   * Imports a BDBag-format file. Files that exist in the bag are imported directly, whereas references are only
   * stored by reference and fetched on-demand.
   * @param params The `DatasetService.DatasetImportBagDataParams` containing the following parameters:
   *
   * - `public`: Whether the folder should be publicly visible. Defaults to False.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: Parent ID for the new parent of this folder.
   *
   * - `bagFile`: The file to upload
   */
  datasetImportBagData(params: DatasetService.DatasetImportBagDataParams): __Observable<null> {
    return this.datasetImportBagDataResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * This does not upload or copy the existing data, it just creates references to it in the Girder data hierarchy. Deleting those references will not delete the underlying data. This operation is currently only supported for DataONE repositories.
   * If the parentId and the parentType is not provided, data will be registered into home directory of the user calling the endpoint
   * @param params The `DatasetService.DatasetImportDataParams` containing the following parameters:
   *
   * - `dataMap`: A list of data mappings
   *
   * - `public`: Whether the folder should be publicly visible. Defaults to True.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: Parent ID for the new parent of this folder.
   *
   * - `base_url`: The node endpoint url. This can be used to register datasets from custom networks, such as the DataONE development network. This can be passed in as an ordinary string. Examples include https://dev.nceas.ucsb.edu/knb/d1/mn/v2 and https://cn.dataone.org/cn/v2
   */
  datasetImportDataResponse(params: DatasetService.DatasetImportDataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.dataMap;
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.baseUrl != null) __params = __params.set('base_url', params.baseUrl.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/dataset/register`, __body, {
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
   * This does not upload or copy the existing data, it just creates references to it in the Girder data hierarchy. Deleting those references will not delete the underlying data. This operation is currently only supported for DataONE repositories.
   * If the parentId and the parentType is not provided, data will be registered into home directory of the user calling the endpoint
   * @param params The `DatasetService.DatasetImportDataParams` containing the following parameters:
   *
   * - `dataMap`: A list of data mappings
   *
   * - `public`: Whether the folder should be publicly visible. Defaults to True.
   *
   * - `parentType`: Type of the folder's parent
   *
   * - `parentId`: Parent ID for the new parent of this folder.
   *
   * - `base_url`: The node endpoint url. This can be used to register datasets from custom networks, such as the DataONE development network. This can be passed in as an ordinary string. Examples include https://dev.nceas.ucsb.edu/knb/d1/mn/v2 and https://cn.dataone.org/cn/v2
   */
  datasetImportData(params: DatasetService.DatasetImportDataParams): __Observable<null> {
    return this.datasetImportDataResponse(params).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the Dataset.
   */
  datasetDeleteUserDatasetResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/dataset/${id}`, __body, {
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
   * @param id The ID of the Dataset.
   */
  datasetDeleteUserDataset(id: string): __Observable<null> {
    return this.datasetDeleteUserDatasetResponse(id).pipe(__map((_r) => _r.body as null));
  }

  /**
   * @param id The ID of the Dataset.
   */
  datasetGetDatasetResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/dataset/${id}`, __body, {
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
   * @param id The ID of the Dataset.
   */
  datasetGetDataset(id: string): __Observable<null> {
    return this.datasetGetDatasetResponse(id).pipe(__map((_r) => _r.body as null));
  }
}

module DatasetService {
  /**
   * Parameters for datasetListDatasets
   */
  export interface DatasetListDatasetsParams {
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
     * If True, filters results to datasets registered by the user.Defaults to False.
     */
    myData?: boolean;

    /**
     * Result set size limit.
     */
    limit?: number;

    /**
     * Filter datasets by an identifier
     */
    identifiers?: string;
  }

  /**
   * Parameters for datasetImportBagData
   */
  export interface DatasetImportBagDataParams {
    /**
     * Whether the folder should be publicly visible. Defaults to True.
     */
    public?: boolean;

    /**
     * Type of the folder's parent
     */
    parentType?: 'folder' | 'user' | 'collection';

    /**
     * Parent ID for the new parent of this folder.
     */
    parentId?: string;

    /**
     * Binary data chunk to upload as body.
     */
    bagFile: string | Blob | ArrayBuffer;
  }

  /**
   * Parameters for datasetImportData
   */
  export interface DatasetImportDataParams {
    /**
     * A list of data mappings
     */
    dataMap: string;

    /**
     * Whether the folder should be publicly visible. Defaults to True.
     */
    public?: boolean;

    /**
     * Type of the folder's parent
     */
    parentType?: 'folder' | 'user' | 'collection';

    /**
     * Parent ID for the new parent of this folder.
     */
    parentId?: string;

    /**
     * The node endpoint url. This can be used to register datasets from custom networks, such as the DataONE development network. This can be passed in as an ordinary string. Examples include https://dev.nceas.ucsb.edu/knb/d1/mn/v2 and https://cn.dataone.org/cn/v2
     */
    baseUrl?: string;
  }
}

export { DatasetService };
