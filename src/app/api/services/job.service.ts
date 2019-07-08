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
class JobService extends __BaseService {
  static readonly jobListJobsPath = '/job';
  static readonly jobCreateJobPath = '/job';
  static readonly jobListAllJobsPath = '/job/all';
  static readonly jobJobsTypesAndStatusesPath = '/job/typeandstatus';
  static readonly jobAllJobsTypesAndStatusesPath = '/job/typeandstatus/all';
  static readonly jobDeleteJobPath = '/job/{id}';
  static readonly jobGetJobPath = '/job/{id}';
  static readonly jobUpdateJobPath = '/job/{id}';
  static readonly jobCancelJobPath = '/job/{id}/cancel';
  static readonly jobGetJobResultPath = '/job/{id}/result';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @param params The `JobService.JobListJobsParams` containing the following parameters:
   *
   * - `userId`: The ID of the user whose jobs will be listed. If not passed or empty, will use the currently logged in user. If set to "None", will list all jobs that do not have an owning user.
   *
   * - `types`: Filter for type
   *
   * - `statuses`: Filter for status
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentId`: Id of the parent job.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  jobListJobsResponse(params: JobService.JobListJobsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.userId != null) __params = __params.set('userId', params.userId.toString());
    if (params.types != null) __params = __params.set('types', params.types.toString());
    if (params.statuses != null) __params = __params.set('statuses', params.statuses.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/job`, __body, {
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
   * @param params The `JobService.JobListJobsParams` containing the following parameters:
   *
   * - `userId`: The ID of the user whose jobs will be listed. If not passed or empty, will use the currently logged in user. If set to "None", will list all jobs that do not have an owning user.
   *
   * - `types`: Filter for type
   *
   * - `statuses`: Filter for status
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `parentId`: Id of the parent job.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  jobListJobs(params: JobService.JobListJobsParams): __Observable<null> {
    return this.jobListJobsResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `JobService.JobCreateJobParams` containing the following parameters:
   *
   * - `type`: Type of the job.
   *
   * - `title`: Title of the job.
   *
   * - `public`: Whether the job is publicly visible.
   *
   * - `parentId`: ID of the parent job.
   *
   * - `otherFields`: Other fields specific to the job handler
   *
   * - `kwargs`: Job keyword arguments
   *
   * - `handler`: Job handler string.
   *
   * - `args`: Job arguments
   */
  jobCreateJobResponse(params: JobService.JobCreateJobParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.type != null) __params = __params.set('type', params.type.toString());
    if (params.title != null) __params = __params.set('title', params.title.toString());
    if (params.public != null) __params = __params.set('public', params.public.toString());
    if (params.parentId != null) __params = __params.set('parentId', params.parentId.toString());
    if (params.otherFields != null) __params = __params.set('otherFields', params.otherFields.toString());
    if (params.kwargs != null) __params = __params.set('kwargs', params.kwargs.toString());
    if (params.handler != null) __params = __params.set('handler', params.handler.toString());
    if (params.args != null) __params = __params.set('args', params.args.toString());
    let req = new HttpRequest<any>('POST', this.rootUrl + `/job`, __body, {
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
   * @param params The `JobService.JobCreateJobParams` containing the following parameters:
   *
   * - `type`: Type of the job.
   *
   * - `title`: Title of the job.
   *
   * - `public`: Whether the job is publicly visible.
   *
   * - `parentId`: ID of the parent job.
   *
   * - `otherFields`: Other fields specific to the job handler
   *
   * - `kwargs`: Job keyword arguments
   *
   * - `handler`: Job handler string.
   *
   * - `args`: Job arguments
   */
  jobCreateJob(params: JobService.JobCreateJobParams): __Observable<null> {
    return this.jobCreateJobResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param params The `JobService.JobListAllJobsParams` containing the following parameters:
   *
   * - `types`: Filter for type
   *
   * - `statuses`: Filter for status
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  jobListAllJobsResponse(params: JobService.JobListAllJobsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.types != null) __params = __params.set('types', params.types.toString());
    if (params.statuses != null) __params = __params.set('statuses', params.statuses.toString());
    if (params.sortdir != null) __params = __params.set('sortdir', params.sortdir.toString());
    if (params.sort != null) __params = __params.set('sort', params.sort.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/job/all`, __body, {
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
   * @param params The `JobService.JobListAllJobsParams` containing the following parameters:
   *
   * - `types`: Filter for type
   *
   * - `statuses`: Filter for status
   *
   * - `sortdir`: Sort order: 1 for ascending, -1 for descending.
   *
   * - `sort`: Field to sort the result set by.
   *
   * - `offset`: Offset into result set.
   *
   * - `limit`: Result set size limit.
   */
  jobListAllJobs(params: JobService.JobListAllJobsParams): __Observable<null> {
    return this.jobListAllJobsResponse(params).pipe(__map(_r => _r.body as null));
  }
  jobJobsTypesAndStatusesResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/job/typeandstatus`, __body, {
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
  jobJobsTypesAndStatuses(): __Observable<null> {
    return this.jobJobsTypesAndStatusesResponse().pipe(__map(_r => _r.body as null));
  }
  jobAllJobsTypesAndStatusesResponse(): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/job/typeandstatus/all`, __body, {
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
  jobAllJobsTypesAndStatuses(): __Observable<null> {
    return this.jobAllJobsTypesAndStatusesResponse().pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the job.
   */
  jobDeleteJobResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('DELETE', this.rootUrl + `/job/${id}`, __body, {
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
   * @param id The ID of the job.
   */
  jobDeleteJob(id: string): __Observable<null> {
    return this.jobDeleteJobResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the job.
   */
  jobGetJobResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/job/${id}`, __body, {
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
   * @param id The ID of the job.
   */
  jobGetJob(id: string): __Observable<null> {
    return this.jobGetJobResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * In most cases, regular users should not call this endpoint. It will typically be used by a batch processing system to send updates regarding the execution of the job. If using a non-user-associated token for authorization, the token must be granted the "jobs.job_<id>" scope, where <id> is the ID of the job being updated.
   * @param params The `JobService.JobUpdateJobParams` containing the following parameters:
   *
   * - `id`: The ID of the job.
   *
   * - `status`: Update the status of the job. See the JobStatus enumeration in the constants module in this plugin for the numerical values of each status.
   *
   * - `progressTotal`: Maximum progress value, set <= 0 to indicate indeterminate progress for this job.
   *
   * - `progressMessage`: Current progress message.
   *
   * - `progressCurrent`: Current progress value.
   *
   * - `overwrite`: If passing a log parameter, you may set this to "true" if you wish to overwrite the log field rather than append to it.
   *
   * - `notify`: If this update should trigger a notification, set this field to true.
   *
   * - `log`: A message to add to the job's log field. If you want to overwrite any existing log content, pass another parameter "overwrite=true".
   */
  jobUpdateJobResponse(params: JobService.JobUpdateJobParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.status != null) __params = __params.set('status', params.status.toString());
    if (params.progressTotal != null) __params = __params.set('progressTotal', params.progressTotal.toString());
    if (params.progressMessage != null) __params = __params.set('progressMessage', params.progressMessage.toString());
    if (params.progressCurrent != null) __params = __params.set('progressCurrent', params.progressCurrent.toString());
    if (params.overwrite != null) __params = __params.set('overwrite', params.overwrite.toString());
    if (params.notify != null) __params = __params.set('notify', params.notify.toString());
    if (params.log != null) __params = __params.set('log', params.log.toString());
    let req = new HttpRequest<any>('PUT', this.rootUrl + `/job/${params.id}`, __body, {
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
   * In most cases, regular users should not call this endpoint. It will typically be used by a batch processing system to send updates regarding the execution of the job. If using a non-user-associated token for authorization, the token must be granted the "jobs.job_<id>" scope, where <id> is the ID of the job being updated.
   * @param params The `JobService.JobUpdateJobParams` containing the following parameters:
   *
   * - `id`: The ID of the job.
   *
   * - `status`: Update the status of the job. See the JobStatus enumeration in the constants module in this plugin for the numerical values of each status.
   *
   * - `progressTotal`: Maximum progress value, set <= 0 to indicate indeterminate progress for this job.
   *
   * - `progressMessage`: Current progress message.
   *
   * - `progressCurrent`: Current progress value.
   *
   * - `overwrite`: If passing a log parameter, you may set this to "true" if you wish to overwrite the log field rather than append to it.
   *
   * - `notify`: If this update should trigger a notification, set this field to true.
   *
   * - `log`: A message to add to the job's log field. If you want to overwrite any existing log content, pass another parameter "overwrite=true".
   */
  jobUpdateJob(params: JobService.JobUpdateJobParams): __Observable<null> {
    return this.jobUpdateJobResponse(params).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the job.
   */
  jobCancelJobResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('PUT', this.rootUrl + `/job/${id}/cancel`, __body, {
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
   * @param id The ID of the job.
   */
  jobCancelJob(id: string): __Observable<null> {
    return this.jobCancelJobResponse(id).pipe(__map(_r => _r.body as null));
  }

  /**
   * @param id The ID of the job.
   */
  jobGetJobResultResponse(id: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>('GET', this.rootUrl + `/job/${id}/result`, __body, {
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
   * @param id The ID of the job.
   */
  jobGetJobResult(id: string): __Observable<null> {
    return this.jobGetJobResultResponse(id).pipe(__map(_r => _r.body as null));
  }
}

module JobService {
  /**
   * Parameters for jobListJobs
   */
  export interface JobListJobsParams {
    /**
     * The ID of the user whose jobs will be listed. If not passed or empty, will use the currently logged in user. If set to "None", will list all jobs that do not have an owning user.
     */
    userId?: string;

    /**
     * Filter for type
     */
    types?: string;

    /**
     * Filter for status
     */
    statuses?: string;

    /**
     * Sort order: 1 for ascending, -1 for descending.
     */
    sortdir?: 1 | -1;

    /**
     * Field to sort the result set by.
     */
    sort?: string;

    /**
     * Id of the parent job.
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
   * Parameters for jobCreateJob
   */
  export interface JobCreateJobParams {
    /**
     * Type of the job.
     */
    type: string;

    /**
     * Title of the job.
     */
    title: string;

    /**
     * Whether the job is publicly visible.
     */
    public?: boolean;

    /**
     * ID of the parent job.
     */
    parentId?: string;

    /**
     * Other fields specific to the job handler
     */
    otherFields?: string;

    /**
     * Job keyword arguments
     */
    kwargs?: string;

    /**
     * Job handler string.
     */
    handler?: string;

    /**
     * Job arguments
     */
    args?: string;
  }

  /**
   * Parameters for jobListAllJobs
   */
  export interface JobListAllJobsParams {
    /**
     * Filter for type
     */
    types?: string;

    /**
     * Filter for status
     */
    statuses?: string;

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
   * Parameters for jobUpdateJob
   */
  export interface JobUpdateJobParams {
    /**
     * The ID of the job.
     */
    id: string;

    /**
     * Update the status of the job. See the JobStatus enumeration in the constants module in this plugin for the numerical values of each status.
     */
    status?: string;

    /**
     * Maximum progress value, set <= 0 to indicate indeterminate progress for this job.
     */
    progressTotal?: number;

    /**
     * Current progress message.
     */
    progressMessage?: string;

    /**
     * Current progress value.
     */
    progressCurrent?: number;

    /**
     * If passing a log parameter, you may set this to "true" if you wish to overwrite the log field rather than append to it.
     */
    overwrite?: boolean;

    /**
     * If this update should trigger a notification, set this field to true.
     */
    notify?: boolean;

    /**
     * A message to add to the job's log field. If you want to overwrite any existing log content, pass another parameter "overwrite=true".
     */
    log?: string;
  }
}

export { JobService };
