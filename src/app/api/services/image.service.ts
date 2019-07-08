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
class ImageService extends __BaseService {
  static readonly imageListImagesPath = '/image';
  static readonly imageCreateImagePath = '/image';
  static readonly imageDeleteImagePath = '/image/{id}';
  static readonly imageGetImagePath = '/image/{id}';
  static readonly imageUpdateImagePath = '/image/{id}';
  static readonly imageGetImageAccessPath = '/image/{id}/access';
  static readonly imageUpdateImageAccessPath = '/image/{id}/access';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `ImageService.ImageListImagesParams` containing the following parameters:
   *
   * - `text`: Perform a full text search for image with a matching name or description.
   *
   * - `tag`: Search all images with a given tag.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentId`: The ID of the image's parent.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  imageListImagesResponse(params: ImageService.ImageListImagesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.text != null) __params = __params.set('text', params.text.toString());
    if (params.tag != null) __params = __params.set('tag', params.tag.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/image`, __body, {
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
   * @param params The `ImageService.ImageListImagesParams` containing the following parameters:
   *
   * - `text`: Perform a full text search for image with a matching name or description.
   *
   * - `tag`: Search all images with a given tag.
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentId`: The ID of the image's parent.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  imageListImages(params: ImageService.ImageListImagesParams): __Observable<null> {
    return this.imageListImagesResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ImageService.ImageCreateImageParams` containing the following parameters:
   *
   * - `tags`: A human readable labels for the image.
   *
   * - `public`: Whether the image should be publicly visible. Defaults to True.
   *
   * - `name`: A name of the image.
   *
   * - `iframe`: If "true", tales using this image can be embedded in an iframe
   *
   * - `icon`: An icon representing the content of the image.
   *
   * - `description`: A description of the image.
   *
   * - `config`: Default image runtime configuration
   */
  imageCreateImageResponse(params: ImageService.ImageCreateImageParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.tags != null) __params = __params.set('tags', params.tags.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.iframe != null) __params = __params.set('iframe', params.iframe.toString());
    if (params.icon != null) __params = __params.set('icon', params.icon.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    if (params.config != null) __params = __params.set('config', params.config.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/image`, __body, {
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
   * @param params The `ImageService.ImageCreateImageParams` containing the following parameters:
   *
   * - `tags`: A human readable labels for the image.
   *
   * - `public`: Whether the image should be publicly visible. Defaults to True.
   *
   * - `name`: A name of the image.
   *
   * - `iframe`: If "true", tales using this image can be embedded in an iframe
   *
   * - `icon`: An icon representing the content of the image.
   *
   * - `description`: A description of the image.
   *
   * - `config`: Default image runtime configuration
   */
  imageCreateImage(params: ImageService.ImageCreateImageParams): __Observable<null> {
    return this.imageCreateImageResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the image.
   */
  imageDeleteImageResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/image/${id}`, __body, {
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
   * @param id The ID of the image.
   */
  imageDeleteImage(id: string): __Observable<null> {
    return this.imageDeleteImageResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  imageGetImageResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/image/${id}`, __body, {
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
  imageGetImage(id: string): __Observable<null> {
    return this.imageGetImageResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ImageService.ImageUpdateImageParams` containing the following parameters:
   *
   * - `id`: The ID of the image.
   *
   * - `tags`: A human readable labels for the image.
   *
   * - `public`: Whether the image should be publicly visible. Defaults to True.
   *
   * - `name`: A name of the image.
   *
   * - `iframe`: If "true", tales using this image can be embedded in an iframe
   *
   * - `icon`: An icon representing the content of the image.
   *
   * - `description`: A description of the image.
   */
  imageUpdateImageResponse(params: ImageService.ImageUpdateImageParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.tags != null) __params = __params.set('tags', params.tags.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.name != null) __params = __params.set('name', params.name.toString());
    if (params.iframe != null) __params = __params.set('iframe', params.iframe.toString());
    if (params.icon != null) __params = __params.set('icon', params.icon.toString());
    if (params.description != null) __params = __params.set('description', params.description.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/image/${params.id}`, __body, {
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
   * @param params The `ImageService.ImageUpdateImageParams` containing the following parameters:
   *
   * - `id`: The ID of the image.
   *
   * - `tags`: A human readable labels for the image.
   *
   * - `public`: Whether the image should be publicly visible. Defaults to True.
   *
   * - `name`: A name of the image.
   *
   * - `iframe`: If "true", tales using this image can be embedded in an iframe
   *
   * - `icon`: An icon representing the content of the image.
   *
   * - `description`: A description of the image.
   */
  imageUpdateImage(params: ImageService.ImageUpdateImageParams): __Observable<null> {
    return this.imageUpdateImageResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the document.
   */
  imageGetImageAccessResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/image/${id}/access`, __body, {
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
  imageGetImageAccess(id: string): __Observable<null> {
    return this.imageGetImageAccessResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `ImageService.ImageUpdateImageAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The JSON-encoded access control list.
   *
   * - `publicFlags`: JSON list of public access flags.
   *
   * - `public`: Whether the image should be publicly visible.
   */
  imageUpdateImageAccessResponse(params: ImageService.ImageUpdateImageAccessParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.access != null) __params = __params.set('access', params.access.toString());
    if (params.publicFlags != null) __params = __params.set('publicFlags', params.publicFlags.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/image/${params.id}/access`, __body, {
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
   * @param params The `ImageService.ImageUpdateImageAccessParams` containing the following parameters:
   *
   * - `id`: The ID of the document.
   *
   * - `access`: The JSON-encoded access control list.
   *
   * - `publicFlags`: JSON list of public access flags.
   *
   * - `public`: Whether the image should be publicly visible.
   */
  imageUpdateImageAccess(params: ImageService.ImageUpdateImageAccessParams): __Observable<null> {
    return this.imageUpdateImageAccessResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module ImageService {
  /**
   * Parameters for imageListImages
   */
  export interface ImageListImagesParams {
    /**
     * Perform a full text search for image with a matching name or description.
     */
    text?: string;

    /**
     * Search all images with a given tag.
     */
    tag?: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * The ID of the image's parent.
     */
    parentId?: string;

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
   * Parameters for imageCreateImage
   */
  export interface ImageCreateImageParams {
    /**
     * A human readable labels for the image.
     */
    tags?: string;

    /**
     * Whether the image should be publicly visible. Defaults to True.
     */
    public?: boolean;

    /**
     * A name of the image.
     */
    name?: string;

    /**
     * If "true", tales using this image can be embedded in an iframe
     */
    iframe?: boolean;

    /**
     * An icon representing the content of the image.
     */
    icon?: string;

    /**
     * A description of the image.
     */
    description?: string;

    /**
     * Default image runtime configuration
     */
    config?: string;
  }

  /**
   * Parameters for imageUpdateImage
   */
  export interface ImageUpdateImageParams {
    /**
     * The ID of the image.
     */
    id: string;

    /**
     * A human readable labels for the image.
     */
    tags?: string;

    /**
     * Whether the image should be publicly visible. Defaults to True.
     */
    public?: boolean;

    /**
     * A name of the image.
     */
    name?: string;

    /**
     * If "true", tales using this image can be embedded in an iframe
     */
    iframe?: boolean;

    /**
     * An icon representing the content of the image.
     */
    icon?: string;

    /**
     * A description of the image.
     */
    description?: string;
  }

  /**
   * Parameters for imageUpdateImageAccess
   */
  export interface ImageUpdateImageAccessParams {
    /**
     * The ID of the document.
     */
    id: string;

    /**
     * The JSON-encoded access control list.
     */
    access: string;

    /**
     * JSON list of public access flags.
     */
    publicFlags?: string;

    /**
     * Whether the image should be publicly visible.
     */
    public?: boolean;
  }
}

export { ImageService };
