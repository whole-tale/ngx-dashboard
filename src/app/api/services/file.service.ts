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
class FileService extends __BaseService {
  static readonly fileInitUploadPath = '/file';
  static readonly fileReadChunkPath = '/file/chunk';
  static readonly fileFinalizeUploadPath = '/file/completion';
  static readonly fileRequestOffsetPath = '/file/offset';
  static readonly fileCancelUploadPath = '/file/upload/{id}';
  static readonly fileDeleteFilePath = '/file/{id}';
  static readonly fileGetFilePath = '/file/{id}';
  static readonly fileUpdateFilePath = '/file/{id}';
  static readonly fileUpdateFileContentsPath = '/file/{id}/contents';
  static readonly fileCopyPath = '/file/{id}/copy';
  static readonly fileDownloadPath = '/file/{id}/download';
  static readonly fileDownloadWithNamePath = '/file/{id}/download/{name}';
  static readonly fileMoveFileToAssetstorePath = '/file/{id}/move';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Use POST /file/chunk to send the contents of the file.  The data for the first chunk of the file can be included with this query by sending it as the body of the request using an appropriate content-type and with the other parameters as part of the query string.  If the entire file is uploaded via this call, the resulting file is returned.
   * @param params The `FileService.FileInitUploadParams` containing the following parameters:
   *
   * - `parentType`: Type being uploaded into.
   *
   * - `parentId`: The ID of the parent.
   *
   * - `name`: Name of the file being created.
   *
   * - `size`: Size in bytes of the file.
   *
   * - `reference`: If included, this information is passed to the data.process event when the upload is complete.
   *
   * - `mimeType`: The MIME type of the file.
   *
   * - `linkUrl`: If this is a link file, pass its URL instead of size and mimeType using this parameter.
   *
   * - `assetstoreId`: Direct the upload to a specific assetstore (admin-only).
   */
  fileInitUploadResponse(params: FileService.FileInitUploadParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.parentType != null) __params = __params.set('parentType', params.parentType.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.reference != null) __params = __params.set('reference', params.reference.toString());
    if (params.mimeType != null) __params = __params.set('mimeType', params.mimeType.toString());
    if (params.linkUrl != null) __params = __params.set('linkUrl', params.linkUrl.toString());
    if (params.assetstoreId != null) __params = __params.set('assetstoreId', params.assetstoreId.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/file`, __body, {
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
   * Use POST /file/chunk to send the contents of the file.  The data for the first chunk of the file can be included with this query by sending it as the body of the request using an appropriate content-type and with the other parameters as part of the query string.  If the entire file is uploaded via this call, the resulting file is returned.
   * @param params The `FileService.FileInitUploadParams` containing the following parameters:
   *
   * - `parentType`: Type being uploaded into.
   *
   * - `parentId`: The ID of the parent.
   *
   * - `name`: Name of the file being created.
   *
   * - `size`: Size in bytes of the file.
   *
   * - `reference`: If included, this information is passed to the data.process event when the upload is complete.
   *
   * - `mimeType`: The MIME type of the file.
   *
   * - `linkUrl`: If this is a link file, pass its URL instead of size and mimeType using this parameter.
   *
   * - `assetstoreId`: Direct the upload to a specific assetstore (admin-only).
   */
  fileInitUpload(params: FileService.FileInitUploadParams): __Observable<null> {
    return this.fileInitUploadResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * The data for the chunk should be sent as the body of the request using an appropriate content-type and with the other parameters as part of the query string.  Alternately, the data can be sent as a file in the "chunk" field in multipart form data.  Multipart uploads are much less efficient and their use is deprecated.
   * @param params The `FileService.FileReadChunkParams` containing the following parameters:
   *
   * - `uploadId`: The ID of the document.
   *
   * - `offset`: Offset of the chunk in the file.
   */
  fileReadChunkResponse(params: FileService.FileReadChunkParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.uploadId !== null && typeof params.uploadId !== 'undefined') {
      __formData.append('uploadId', params.uploadId as string | Blob);
    }
    if (params.offset !== null && typeof params.offset !== 'undefined') {
      __formData.append('offset', JSON.stringify(params.offset));
    }
    let req = new HttpRequest<any>('POST', this.rootUrl + `/file/chunk`, __body, {
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
   * The data for the chunk should be sent as the body of the request using an appropriate content-type and with the other parameters as part of the query string.  Alternately, the data can be sent as a file in the "chunk" field in multipart form data.  Multipart uploads are much less efficient and their use is deprecated.
   * @param params The `FileService.FileReadChunkParams` containing the following parameters:
   *
   * - `uploadId`: The ID of the document.
   *
   * - `offset`: Offset of the chunk in the file.
   */
  fileReadChunk(params: FileService.FileReadChunkParams): __Observable<null> {
    return this.fileReadChunkResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * This is only required in certain non-standard upload behaviors. Clients should know which behavior models require the finalize step to be called in their behavior handlers.
   * @param uploadId The ID of the document.
   */
  fileFinalizeUploadResponse(uploadId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (uploadId !== null && typeof uploadId !== 'undefined') {
      __formData.append('uploadId', uploadId as string | Blob);
    }
    let req = new HttpRequest<any>('POST', this.rootUrl + `/file/completion`, __body, {
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
   * This is only required in certain non-standard upload behaviors. Clients should know which behavior models require the finalize step to be called in their behavior handlers.
   * @param uploadId The ID of the document.
   */
  fileFinalizeUpload(uploadId: string): __Observable<null> {
    return this.fileFinalizeUploadResponse(uploadId).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param uploadId The ID of the document.
   */
  fileRequestOffsetResponse(uploadId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (uploadId !== null && typeof uploadId !== 'undefined') {
      __formData.append('uploadId', uploadId as string | Blob);
    }
    let req = new HttpRequest<any>('GET', this.rootUrl + `/file/offset`, __body, {
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
   * @param uploadId The ID of the document.
   */
  fileRequestOffset(uploadId: string): __Observable<null> {
    return this.fileRequestOffsetResponse(uploadId).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  fileCancelUploadResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/file/upload/${id}`, __body, {
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
  fileCancelUpload(id: string): __Observable<null> {
    return this.fileCancelUploadResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  fileDeleteFileResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/file/${id}`, __body, {
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
  fileDeleteFile(id: string): __Observable<null> {
    return this.fileDeleteFileResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  fileGetFileResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/file/${id}`, __body, {
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
  fileGetFile(id: string): __Observable<null> {
    return this.fileGetFileResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FileService.FileUpdateFileParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `name`: The name to set on the file.
   *
   * - `mimeType`: The MIME type of the file.
   */
  fileUpdateFileResponse(params: FileService.FileUpdateFileParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.mimeType != null) __params = __params.set('mimeType', params.mimeType.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/file/${params.id}`, __body, {
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
   * @param params The `FileService.FileUpdateFileParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `name`: The name to set on the file.
   *
   * - `mimeType`: The MIME type of the file.
   */
  fileUpdateFile(params: FileService.FileUpdateFileParams): __Observable<null> {
    return this.fileUpdateFileResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * After calling this, send the chunks just like you would with a normal file upload.
   * @param params The `FileService.FileUpdateFileContentsParams` containing the following parameters:
   *
   * - `size`: Size in bytes of the new file.
   *
   * - `id`: The ID of the document.
   *
   * - `reference`: If included, this information is passed to the data.process event when the upload is complete.
   *
   * - `assetstoreId`: Direct the upload to a specific assetstore (admin-only).
   */
  fileUpdateFileContentsResponse(params: FileService.FileUpdateFileContentsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.size != null) __params = __params.set('size', params.size.toString());

    if (params.reference != null) __params = __params.set('reference', params.reference.toString());
    if (params.assetstoreId != null) __params = __params.set('assetstoreId', params.assetstoreId.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/file/${params.id}/contents`, __body, {
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
   * After calling this, send the chunks just like you would with a normal file upload.
   * @param params The `FileService.FileUpdateFileContentsParams` containing the following parameters:
   *
   * - `size`: Size in bytes of the new file.
   *
   * - `id`: The ID of the document.
   *
   * - `reference`: If included, this information is passed to the data.process event when the upload is complete.
   *
   * - `assetstoreId`: Direct the upload to a specific assetstore (admin-only).
   */
  fileUpdateFileContents(params: FileService.FileUpdateFileContentsParams): __Observable<null> {
    return this.fileUpdateFileContentsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FileService.FileCopyParams` containing the following parameters:
   *
   * - `itemId`: The ID of the item to copy the file to.
   *
   * - `id`: The ID of the document.
   */
  fileCopyResponse(params: FileService.FileCopyParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;
    if (params.itemId !== null && typeof params.itemId !== 'undefined') {
      __formData.append('itemId', params.itemId as string | Blob);
    }

    let req = new HttpRequest<any>('POST', this.rootUrl + `/file/${params.id}/copy`, __body, {
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
   * @param params The `FileService.FileCopyParams` containing the following parameters:
   *
   * - `itemId`: The ID of the item to copy the file to.
   *
   * - `id`: The ID of the document.
   */
  fileCopy(params: FileService.FileCopyParams): __Observable<null> {
    return this.fileCopyResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * This endpoint also accepts the HTTP "Range" header for partial file downloads.
   * @param params The `FileService.FileDownloadParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `offset`: Start downloading at this offset in bytes within the file.
   *
   * - `extraParameters`: Arbitrary data to send along with the download request.
   *
   * - `endByte`: If you only wish to download part of the file, pass this as the index of the last byte to download. Unlike the HTTP Range header, the endByte parameter is non-inclusive, so you should set it to the index of the byte one past the final byte you wish to receive.
   *
   * - `contentDisposition`: Specify the Content-Disposition response header disposition-type value.
   */
  fileDownloadResponse(params: FileService.FileDownloadParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.extraParameters != null) __params = __params.set('extraParameters', params.extraParameters.toString());
    if (params.endByte != null) __params = __params.set('endByte', params.endByte.toString());
    if (params.contentDisposition != null) __params = __params.set('contentDisposition', params.contentDisposition.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/file/${params.id}/download`, __body, {
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
   * This endpoint also accepts the HTTP "Range" header for partial file downloads.
   * @param params The `FileService.FileDownloadParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `offset`: Start downloading at this offset in bytes within the file.
   *
   * - `extraParameters`: Arbitrary data to send along with the download request.
   *
   * - `endByte`: If you only wish to download part of the file, pass this as the index of the last byte to download. Unlike the HTTP Range header, the endByte parameter is non-inclusive, so you should set it to the index of the byte one past the final byte you wish to receive.
   *
   * - `contentDisposition`: Specify the Content-Disposition response header disposition-type value.
   */
  fileDownload(params: FileService.FileDownloadParams): __Observable<null> {
    return this.fileDownloadResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * The name parameter doesn't alter the download.  Some download clients save files based on the last part of a path, and specifying the name satisfies those clients.
   * @param params The `FileService.FileDownloadWithNameParams` containing the following parameters:
   *
   * - `name`: The name of the file.  This is ignored.
   *
   * - `id`: The ID of the file.
   *
   * - `offset`: Start downloading at this offset in bytes within the file.
   */
  fileDownloadWithNameResponse(params: FileService.FileDownloadWithNameParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/file/${params.id}/download/${params.name}`, __body, {
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
   * The name parameter doesn't alter the download.  Some download clients save files based on the last part of a path, and specifying the name satisfies those clients.
   * @param params The `FileService.FileDownloadWithNameParams` containing the following parameters:
   *
   * - `name`: The name of the file.  This is ignored.
   *
   * - `id`: The ID of the file.
   *
   * - `offset`: Start downloading at this offset in bytes within the file.
   */
  fileDownloadWithName(params: FileService.FileDownloadWithNameParams): __Observable<null> {
    return this.fileDownloadWithNameResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `FileService.FileMoveFileToAssetstoreParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `assetstoreId`: The destination assetstore.
   *
   * - `progress`: Controls whether progress notifications will be sent.
   */
  fileMoveFileToAssetstoreResponse(params: FileService.FileMoveFileToAssetstoreParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __headers.append('Content-Type', 'multipart/form-data');
    let __formData = new FormData();
    __body = __formData;

    if (params.assetstoreId !== null && typeof params.assetstoreId !== 'undefined') {
      __formData.append('assetstoreId', params.assetstoreId as string | Blob);
    }
    if (params.progress != null) __params = __params.set('progress', params.progress.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/file/${params.id}/move`, __body, {
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
   * @param params The `FileService.FileMoveFileToAssetstoreParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `assetstoreId`: The destination assetstore.
   *
   * - `progress`: Controls whether progress notifications will be sent.
   */
  fileMoveFileToAssetstore(params: FileService.FileMoveFileToAssetstoreParams): __Observable<null> {
    return this.fileMoveFileToAssetstoreResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module FileService {
  /**
   * Parameters for fileInitUpload
   */
  export interface FileInitUploadParams {
    /**
     * Type being uploaded into.
     */
    parentType: 'folder' | 'item';

    /**
     * The ID of the parent.
     */
    parentId: string;

    /**
     * Name of the file being created.
     */
    name: string;

    /**
     * Size in bytes of the file.
     */
    size?: number;

    /**
     * If included, this information is passed to the data.process event when the upload is complete.
     */
    reference?: string;

    /**
     * The MIME type of the file.
     */
    mimeType?: string;

    /**
     * If this is a link file, pass its URL instead of size and mimeType using this parameter.
     */
    linkUrl?: string;

    /**
     * Direct the upload to a specific assetstore (admin-only).
     */
    assetstoreId?: string;
  }

  /**
   * Parameters for fileReadChunk
   */
  export interface FileReadChunkParams {
    /**
     * The ID of the document.
     */
    uploadId: string;

    /**
     * Offset of the chunk in the file.
     */
    offset: number;
  }

  /**
   * Parameters for fileUpdateFile
   */
  export interface FileUpdateFileParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The name to set on the file.
     */
    name?: string;

    /**
     * The MIME type of the file.
     */
    mimeType?: string;
  }

  /**
   * Parameters for fileUpdateFileContents
   */
  export interface FileUpdateFileContentsParams {
    /**
     * Size in bytes of the new file.
     */
    size: number;

    /**
     * The ID of the document.
     */
    id: string;

    /**
     * If included, this information is passed to the data.process event when the upload is complete.
     */
    reference?: string;

    /**
     * Direct the upload to a specific assetstore (admin-only).
     */
    assetstoreId?: string;
  }

  /**
   * Parameters for fileCopy
   */
  export interface FileCopyParams {
    /**
     * The ID of the item to copy the file to.
     */
    itemId: string;

    /**
     * The ID of the document.
     */
    id: string;
  }

  /**
   * Parameters for fileDownload
   */
  export interface FileDownloadParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * Start downloading at this offset in bytes within the file.
     */
    offset?: number;

    /**
     * Arbitrary data to send along with the download request.
     */
    extraParameters?: string;

    /**
     * If you only wish to download part of the file, pass this as the index of the last byte to download. Unlike the HTTP Range header, the endByte parameter is non-inclusive, so you should set it to the index of the byte one past the final byte you wish to receive.
     */
    endByte?: number;

    /**
     * Specify the Content-Disposition response header disposition-type value.
     */
    contentDisposition?: 'inline' | 'attachment';
  }

  /**
   * Parameters for fileDownloadWithName
   */
  export interface FileDownloadWithNameParams {
    /**
     * The name of the file.  This is ignored.
     */
    name: string;

    /**
     * The ID of the file.
     */
    id: string;

    /**
     * Start downloading at this offset in bytes within the file.
     */
    offset?: number;
  }

  /**
   * Parameters for fileMoveFileToAssetstore
   */
  export interface FileMoveFileToAssetstoreParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The destination assetstore.
     */
    assetstoreId: string;

    /**
     * Controls whether progress notifications will be sent.
     */
    progress?: boolean;
  }
}

export { FileService };
