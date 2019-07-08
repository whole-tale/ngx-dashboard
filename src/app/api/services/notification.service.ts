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
class NotificationService extends __BaseService {
  static readonly notificationListNotificationsPath = '/notification';
  static readonly notificationStreamPath = '/notification/stream';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * This endpoint can be used for manual long-polling when SSE support is disabled or otherwise unavailable. The events are always returned in chronological order.
   * @param since Filter out events before this date.
   */
  notificationListNotificationsResponse(since?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (since != null) __params = __params.set('since', since.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/notification`, __body, {
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
   * This endpoint can be used for manual long-polling when SSE support is disabled or otherwise unavailable. The events are always returned in chronological order.
   * @param since Filter out events before this date.
   */
  notificationListNotifications(since?: string): __Observable<null> {
    return this.notificationListNotificationsResponse(since).pipe(__map(_r => _r.body as null));
  }

  /**
   * This uses long-polling to keep the connection open for several minutes at a time (or longer) and should be requested with an EventSource object or other SSE-capable client. <p>Notifications are returned within a few seconds of when they occur.  When no notification occurs for the timeout duration, the stream is closed. <p>This connection can stay open indefinitely long.
   * @param params The `NotificationService.NotificationStreamParams` containing the following parameters:
   *
   * - `timeout`: The duration without a notification before the stream is closed.
   *
   * - `since`: Filter out events before this time stamp.
   */
  notificationStreamResponse(params: NotificationService.NotificationStreamParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.timeout != null) __params = __params.set('timeout', params.timeout.toString());
    if (params.since != null) __params = __params.set('since', params.since.toString());
    let req = new HttpRequest<any>('GET', this.rootUrl + `/notification/stream`, __body, {
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
   * This uses long-polling to keep the connection open for several minutes at a time (or longer) and should be requested with an EventSource object or other SSE-capable client. <p>Notifications are returned within a few seconds of when they occur.  When no notification occurs for the timeout duration, the stream is closed. <p>This connection can stay open indefinitely long.
   * @param params The `NotificationService.NotificationStreamParams` containing the following parameters:
   *
   * - `timeout`: The duration without a notification before the stream is closed.
   *
   * - `since`: Filter out events before this time stamp.
   */
  notificationStream(params: NotificationService.NotificationStreamParams): __Observable<null> {
    return this.notificationStreamResponse(params).pipe(__map(_r => _r.body as null));
  }
}

module NotificationService {
  /**
   * Parameters for notificationStream
   */
  export interface NotificationStreamParams {
    /**
     * The duration without a notification before the stream is closed.
     */
    timeout?: number;

    /**
     * Filter out events before this time stamp.
     */
    since?: number;
  }
}

export { NotificationService };
