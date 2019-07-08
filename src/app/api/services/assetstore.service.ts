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
class AssetstoreService extends __BaseService {
  static readonly assetstoreFindPath = '/assetstore';
  static readonly assetstoreCreateAssetstorePath = '/assetstore';
  static readonly assetstoreDeleteAssetstorePath = '/assetstore/{id}';
  static readonly assetstoreGetAssetstorePath = '/assetstore/{id}';
  static readonly assetstoreUpdateAssetstorePath = '/assetstore/{id}';
  static readonly assetstoreGetAssetstoreFilesPath = '/assetstore/{id}/files';
  static readonly assetstoreImportDataPath = '/assetstore/{id}/import';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `AssetstoreService.AssetstoreFindParams` containing the following parameters:
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  assetstoreFindResponse(params: AssetstoreService.AssetstoreFindParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/assetstore`, __body, {
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
   * @param params The `AssetstoreService.AssetstoreFindParams` containing the following parameters:
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  assetstoreFind(params: AssetstoreService.AssetstoreFindParams): __Observable<null> {
    return this.assetstoreFindResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * You must be an administrator to call this.
   * @param params The `AssetstoreService.AssetstoreCreateAssetstoreParams` containing the following parameters:
   *
   * - `type`: Type of the assetstore.
   *
   * - `name`: Unique name for the assetstore.
   *
   * - `shard`: Shard the collection (for GridFS type).  Set to "auto" to set up sharding.
   *
   * - `service`: The S3 service host (for S3 type).  Default is s3.amazonaws.com.  This can be used to specify a protocol and port as well using the form [http[s]://](host domain)[:(port)]. Do not include the bucket name here.
   *
   * - `secret`: The AWS secret key to use for authentication (for S3 type).
   *
   * - `root`: Root path on disk (for filesystem type).
   *
   * - `replicaset`: Replica set name (for GridFS type)
   *
   * - `region`: The AWS region to which the S3 bucket belongs.
   *
   * - `readOnly`: If this assetstore is read-only, set this to true.
   *
   * - `prefix`: Optional path prefix within the bucket under which files will be stored (for S3 type).
   *
   * - `perms`: File creation permissions (for filesystem type).
   *
   * - `mongohost`: Mongo host URI (for GridFS type)
   *
   * - `inferCredentials`: The credentials for connecting to S3 will be inferred by Boto rather than explicitly passed. Inferring credentials will ignore accessKeyId and secret.
   *
   * - `db`: Database name (for GridFS type)
   *
   * - `bucket`: The S3 bucket to store data in (for S3 type).
   *
   * - `accessKeyId`: The AWS access key ID to use for authentication (for S3 type).
   */
  assetstoreCreateAssetstoreResponse(params: AssetstoreService.AssetstoreCreateAssetstoreParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.type != null) __params = __params.set('type', params.type.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.shard != null) __params = __params.set('shard', params.shard.toString());
    if (params.service != null) __params = __params.set('service', params.service.toString());
    if (params.secret != null) __params = __params.set('secret', params.secret.toString());
    if (params.root != null) __params = __params.set('root', params.root.toString());
    if (params.replicaset != null) __params = __params.set('replicaset', params.replicaset.toString());
    if (params.region != null) __params = __params.set('region', params.region.toString());
    if (params.readOnly != null) __params = __params.set('readOnly', params.readOnly.toString());
    if (params.prefix != null) __params = __params.set('prefix', params.prefix.toString());
    if (params.perms != null) __params = __params.set('perms', params.perms.toString());
    if (params.mongohost != null) __params = __params.set('mongohost', params.mongohost.toString());
    if (params.inferCredentials != null) __params = __params.set('inferCredentials', params.inferCredentials.toString());
    if (params.db != null) __params = __params.set('db', params.db.toString());
    if (params.bucket != null) __params = __params.set('bucket', params.bucket.toString());
    if (params.accessKeyId != null) __params = __params.set('accessKeyId', params.accessKeyId.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/assetstore`, __body, {
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
   * You must be an administrator to call this.
   * @param params The `AssetstoreService.AssetstoreCreateAssetstoreParams` containing the following parameters:
   *
   * - `type`: Type of the assetstore.
   *
   * - `name`: Unique name for the assetstore.
   *
   * - `shard`: Shard the collection (for GridFS type).  Set to "auto" to set up sharding.
   *
   * - `service`: The S3 service host (for S3 type).  Default is s3.amazonaws.com.  This can be used to specify a protocol and port as well using the form [http[s]://](host domain)[:(port)]. Do not include the bucket name here.
   *
   * - `secret`: The AWS secret key to use for authentication (for S3 type).
   *
   * - `root`: Root path on disk (for filesystem type).
   *
   * - `replicaset`: Replica set name (for GridFS type)
   *
   * - `region`: The AWS region to which the S3 bucket belongs.
   *
   * - `readOnly`: If this assetstore is read-only, set this to true.
   *
   * - `prefix`: Optional path prefix within the bucket under which files will be stored (for S3 type).
   *
   * - `perms`: File creation permissions (for filesystem type).
   *
   * - `mongohost`: Mongo host URI (for GridFS type)
   *
   * - `inferCredentials`: The credentials for connecting to S3 will be inferred by Boto rather than explicitly passed. Inferring credentials will ignore accessKeyId and secret.
   *
   * - `db`: Database name (for GridFS type)
   *
   * - `bucket`: The S3 bucket to store data in (for S3 type).
   *
   * - `accessKeyId`: The AWS access key ID to use for authentication (for S3 type).
   */
  assetstoreCreateAssetstore(params: AssetstoreService.AssetstoreCreateAssetstoreParams): __Observable<null> {
    return this.assetstoreCreateAssetstoreResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * This will fail if there are any files in the assetstore.
   * @param id The ID of the document.
   */
  assetstoreDeleteAssetstoreResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/assetstore/${id}`, __body, {
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
   * This will fail if there are any files in the assetstore.
   * @param id The ID of the document.
   */
  assetstoreDeleteAssetstore(id: string): __Observable<null> {
    return this.assetstoreDeleteAssetstoreResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  assetstoreGetAssetstoreResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/assetstore/${id}`, __body, {
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
   * @param id The ID of the document.
   */
  assetstoreGetAssetstore(id: string): __Observable<null> {
    return this.assetstoreGetAssetstoreResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `AssetstoreService.AssetstoreUpdateAssetstoreParams` containing the following parameters:
   *
   * - `name`: Unique name for the assetstore.
   *
   * - `id`: The ID of the document.
   *
   * - `current`: Whether this is the current assetstore
   *
   * - `shard`: Shard the collection (for GridFS type).  Set to "auto" to set up sharding.
   *
   * - `service`: The S3 service host (for S3 type).  Default is s3.amazonaws.com.  This can be used to specify a protocol and port as well using the form [http[s]://](host domain)[:(port)]. Do not include the bucket name here.
   *
   * - `secret`: The AWS secret key to use for authentication (for S3 type).
   *
   * - `root`: Root path on disk (for Filesystem type)
   *
   * - `replicaset`: Replica set name (for GridFS type)
   *
   * - `region`: The AWS region to which the S3 bucket belongs.
   *
   * - `readOnly`: If this assetstore is read-only, set this to true.
   *
   * - `prefix`: Optional path prefix within the bucket under which files will be stored (for S3 type).
   *
   * - `perms`: File creation permissions (for Filesystem type)
   *
   * - `mongohost`: Mongo host URI (for GridFS type)
   *
   * - `inferCredentials`: The credentials for connecting to S3 will be inferred by Boto rather than explicitly passed. Inferring credentials will ignore accessKeyId and secret.
   *
   * - `db`: Database name (for GridFS type)
   *
   * - `bucket`: The S3 bucket to store data in (for S3 type).
   *
   * - `accessKeyId`: The AWS access key ID to use for authentication (for S3 type).
   */
  assetstoreUpdateAssetstoreResponse(params: AssetstoreService.AssetstoreUpdateAssetstoreParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.name != null) __params = __params.set('name', params.name.toString());

    if (params.current != null) __params = __params.set('current', params.current.toString());
    if (params.shard != null) __params = __params.set('shard', params.shard.toString());
    if (params.service != null) __params = __params.set('service', params.service.toString());
    if (params.secret != null) __params = __params.set('secret', params.secret.toString());
    if (params.root != null) __params = __params.set('root', params.root.toString());
    if (params.replicaset != null) __params = __params.set('replicaset', params.replicaset.toString());
    if (params.region != null) __params = __params.set('region', params.region.toString());
    if (params.readOnly != null) __params = __params.set('readOnly', params.readOnly.toString());
    if (params.prefix != null) __params = __params.set('prefix', params.prefix.toString());
    if (params.perms != null) __params = __params.set('perms', params.perms.toString());
    if (params.mongohost != null) __params = __params.set('mongohost', params.mongohost.toString());
    if (params.inferCredentials != null) __params = __params.set('inferCredentials', params.inferCredentials.toString());
    if (params.db != null) __params = __params.set('db', params.db.toString());
    if (params.bucket != null) __params = __params.set('bucket', params.bucket.toString());
    if (params.accessKeyId != null) __params = __params.set('accessKeyId', params.accessKeyId.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/assetstore/${params.id}`, __body, {
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
   * @param params The `AssetstoreService.AssetstoreUpdateAssetstoreParams` containing the following parameters:
   *
   * - `name`: Unique name for the assetstore.
   *
   * - `id`: The ID of the document.
   *
   * - `current`: Whether this is the current assetstore
   *
   * - `shard`: Shard the collection (for GridFS type).  Set to "auto" to set up sharding.
   *
   * - `service`: The S3 service host (for S3 type).  Default is s3.amazonaws.com.  This can be used to specify a protocol and port as well using the form [http[s]://](host domain)[:(port)]. Do not include the bucket name here.
   *
   * - `secret`: The AWS secret key to use for authentication (for S3 type).
   *
   * - `root`: Root path on disk (for Filesystem type)
   *
   * - `replicaset`: Replica set name (for GridFS type)
   *
   * - `region`: The AWS region to which the S3 bucket belongs.
   *
   * - `readOnly`: If this assetstore is read-only, set this to true.
   *
   * - `prefix`: Optional path prefix within the bucket under which files will be stored (for S3 type).
   *
   * - `perms`: File creation permissions (for Filesystem type)
   *
   * - `mongohost`: Mongo host URI (for GridFS type)
   *
   * - `inferCredentials`: The credentials for connecting to S3 will be inferred by Boto rather than explicitly passed. Inferring credentials will ignore accessKeyId and secret.
   *
   * - `db`: Database name (for GridFS type)
   *
   * - `bucket`: The S3 bucket to store data in (for S3 type).
   *
   * - `accessKeyId`: The AWS access key ID to use for authentication (for S3 type).
   */
  assetstoreUpdateAssetstore(params: AssetstoreService.AssetstoreUpdateAssetstoreParams): __Observable<null> {
    return this.assetstoreUpdateAssetstoreResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `AssetstoreService.AssetstoreGetAssetstoreFilesParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  assetstoreGetAssetstoreFilesResponse(
    params: AssetstoreService.AssetstoreGetAssetstoreFilesParams
  ): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/assetstore/${params.id}/files`, __body, {
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
   * @param params The `AssetstoreService.AssetstoreGetAssetstoreFilesParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  assetstoreGetAssetstoreFiles(params: AssetstoreService.AssetstoreGetAssetstoreFilesParams): __Observable<null> {
    return this.assetstoreGetAssetstoreFilesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * This does not move or copy the existing data, it just creates references to it in the Girder data hierarchy. Deleting those references will not delete the underlying data. This operation is currently only supported for S3 assetstores.
   * @param params The `AssetstoreService.AssetstoreImportDataParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `destinationType`: Type of the destination resource.
   *
   * - `destinationId`: ID of a folder, collection, or user in Girder under which the data will be imported.
   *
   * - `progress`: Whether to record progress on the import.
   *
   * - `leafFoldersAsItems`: Whether folders containing only files should be imported as items.
   *
   * - `importPath`: Root path within the underlying storage system to import.
   *
   * - `fileIncludeRegex`: If set, only filenames matching this regular expression will be imported.
   *
   * - `fileExcludeRegex`: If set, only filenames that do not match this regular expression will be imported. If a file matches both the include and exclude regex, it will be excluded.
   */
  assetstoreImportDataResponse(params: AssetstoreService.AssetstoreImportDataParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.destinationType != null) __params = __params.set('destinationType', params.destinationType.toString());
    if (params.destinationId != null) __params = __params.set('destinationId', params.destinationId.toString());
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    if (params.leafFoldersAsItems != null) __params = __params.set('leafFoldersAsItems', params.leafFoldersAsItems.toString());
    if (params.importPath != null) __params = __params.set('importPath', params.importPath.toString());
    if (params.fileIncludeRegex != null) __params = __params.set('fileIncludeRegex', params.fileIncludeRegex.toString());
    if (params.fileExcludeRegex != null) __params = __params.set('fileExcludeRegex', params.fileExcludeRegex.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/assetstore/${params.id}/import`, __body, {
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
   * This does not move or copy the existing data, it just creates references to it in the Girder data hierarchy. Deleting those references will not delete the underlying data. This operation is currently only supported for S3 assetstores.
   * @param params The `AssetstoreService.AssetstoreImportDataParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `destinationType`: Type of the destination resource.
   *
   * - `destinationId`: ID of a folder, collection, or user in Girder under which the data will be imported.
   *
   * - `progress`: Whether to record progress on the import.
   *
   * - `leafFoldersAsItems`: Whether folders containing only files should be imported as items.
   *
   * - `importPath`: Root path within the underlying storage system to import.
   *
   * - `fileIncludeRegex`: If set, only filenames matching this regular expression will be imported.
   *
   * - `fileExcludeRegex`: If set, only filenames that do not match this regular expression will be imported. If a file matches both the include and exclude regex, it will be excluded.
   */
  assetstoreImportData(params: AssetstoreService.AssetstoreImportDataParams): __Observable<null> {
    return this.assetstoreImportDataResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module AssetstoreService {
  /**
   * Parameters for assetstoreFind
   */
  export interface AssetstoreFindParams {
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
     * Result set size limit.
     */
    limit?: number;
  }

  /**
   * Parameters for assetstoreCreateAssetstore
   */
  export interface AssetstoreCreateAssetstoreParams {
    /**
     * Type of the assetstore.
     */
    type: number;

    /**
     * Unique name for the assetstore.
     */
    name: string;

    /**
     * Shard the collection (for GridFS type).  Set to "auto" to set up sharding.
     */
    shard?: string;

    /**
     * The S3 service host (for S3 type).  Default is s3.amazonaws.com.  This can be used to specify a protocol and port as well using the form [http[s]://](host domain)[:(port)]. Do not include the bucket name here.
     */
    service?: string;

    /**
     * The AWS secret key to use for authentication (for S3 type).
     */
    secret?: string;

    /**
     * Root path on disk (for filesystem type).
     */
    root?: string;

    /**
     * Replica set name (for GridFS type)
     */
    replicaset?: string;

    /**
     * The AWS region to which the S3 bucket belongs.
     */
    region?: string;

    /**
     * If this assetstore is read-only, set this to true.
     */
    readOnly?: boolean;

    /**
     * Optional path prefix within the bucket under which files will be stored (for S3 type).
     */
    prefix?: string;

    /**
     * File creation permissions (for filesystem type).
     */
    perms?: string;

    /**
     * Mongo host URI (for GridFS type)
     */
    mongohost?: string;

    /**
     * The credentials for connecting to S3 will be inferred by Boto rather than explicitly passed. Inferring credentials will ignore accessKeyId and secret.
     */
    inferCredentials?: boolean;

    /**
     * Database name (for GridFS type)
     */
    db?: string;

    /**
     * The S3 bucket to store data in (for S3 type).
     */
    bucket?: string;

    /**
     * The AWS access key ID to use for authentication (for S3 type).
     */
    accessKeyId?: string;
  }

  /**
   * Parameters for assetstoreUpdateAssetstore
   */
  export interface AssetstoreUpdateAssetstoreParams {
    /**
     * Unique name for the assetstore.
     */
    name: string;

    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Whether this is the current assetstore
     */
    current: boolean;

    /**
     * Shard the collection (for GridFS type).  Set to "auto" to set up sharding.
     */
    shard?: string;

    /**
     * The S3 service host (for S3 type).  Default is s3.amazonaws.com.  This can be used to specify a protocol and port as well using the form [http[s]://](host domain)[:(port)]. Do not include the bucket name here.
     */
    service?: string;

    /**
     * The AWS secret key to use for authentication (for S3 type).
     */
    secret?: string;

    /**
     * Root path on disk (for Filesystem type)
     */
    root?: string;

    /**
     * Replica set name (for GridFS type)
     */
    replicaset?: string;

    /**
     * The AWS region to which the S3 bucket belongs.
     */
    region?: string;

    /**
     * If this assetstore is read-only, set this to true.
     */
    readOnly?: boolean;

    /**
     * Optional path prefix within the bucket under which files will be stored (for S3 type).
     */
    prefix?: string;

    /**
     * File creation permissions (for Filesystem type)
     */
    perms?: string;

    /**
     * Mongo host URI (for GridFS type)
     */
    mongohost?: string;

    /**
     * The credentials for connecting to S3 will be inferred by Boto rather than explicitly passed. Inferring credentials will ignore accessKeyId and secret.
     */
    inferCredentials?: boolean;

    /**
     * Database name (for GridFS type)
     */
    db?: string;

    /**
     * The S3 bucket to store data in (for S3 type).
     */
    bucket?: string;

    /**
     * The AWS access key ID to use for authentication (for S3 type).
     */
    accessKeyId?: string;
  }

  /**
   * Parameters for assetstoreGetAssetstoreFiles
   */
  export interface AssetstoreGetAssetstoreFilesParams {
    /**
     * The ID of the document.
     */
    id: string;

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
     * Result set size limit.
     */
    limit?: number;
  }

  /**
   * Parameters for assetstoreImportData
   */
  export interface AssetstoreImportDataParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Type of the destination resource.
     */
    destinationType: 'folder' | 'collection' | 'user';

    /**
     * ID of a folder, collection, or user in Girder under which the data will be imported.
     */
    destinationId: string;

    /**
     * Whether to record progress on the import.
     */
    progress?: boolean;

    /**
     * Whether folders containing only files should be imported as items.
     */
    leafFoldersAsItems?: boolean;

    /**
     * Root path within the underlying storage system to import.
     */
    importPath?: string;

    /**
     * If set, only filenames matching this regular expression will be imported.
     */
    fileIncludeRegex?: string;

    /**
     * If set, only filenames that do not match this regular expression will be imported. If a file matches both the include and exclude regex, it will be excluded.
     */
    fileExcludeRegex?: string;
  }
}

export { AssetstoreService };
