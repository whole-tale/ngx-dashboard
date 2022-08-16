/* tslint:disable */
import { Injectable, OnDestroy } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { GirderEvent } from '@api/events/girder-event';
import { LogService } from '@shared/core';

import { TokenService } from '@api/token.service';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass';

@Injectable({
  providedIn: 'root',
})
class NotificationStreamService implements OnDestroy {
  static readonly Path = '/notification/stream';
  static readonly TimeoutMs = 85;
  // static readonly IntervalDelayMs = 85000;
  private _since: number = 0;

  // interval: any;

  source: EventSource;
  events: Array<any> = [];

  showNotificationStream = false;

  ackAll() {
    const newSince = new Date().getTime() / 1000;
    this.since = newSince;
    this.openNotificationStream(false);
    this.events = [];
  }

  ackOne(evt: Event) {
    // TODO: How to prevent event from redispaying on page load?

    // Remove event from the list to hide it temporarily
    const index = this.events.indexOf(evt);
    this.events.splice(index, 1);
  }

  openNotificationStream(open: boolean = true) {
    this.showNotificationStream = open;
  }

  get since(): number {
    // The leading "+" converts the value to a number
    return +localStorage.getItem('lastRead');
  }

  set since(value: number) {
    this._since = value;
    // number -> string to conform to localStorage
    localStorage.setItem('lastRead', value.toFixed().toString());
    this.source.url = this.url; // This is ugly, but there's no other way
  }

  get token() {
    return this.tokenService.getToken();
  }

  get headers() {
    return { 'Girder-Token': this.token };
  }

  get eventSourceParams() {
    return { headers: this.headers, heartbeatTimeout: 90000 };
  }

  get url() {
    let url = this.config.rootUrl + NotificationStreamService.Path;

    // TODO: Add query-string parameters
    if (this.since) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + `since=${this.since}`;
    }

    let timeout = NotificationStreamService.TimeoutMs;
    if (timeout) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + `timeout=${timeout}`;
    }

    return url;
  }

  constructor(private config: ApiConfiguration, private tokenService: TokenService, private logger: LogService) {}

  ngOnDestroy() {
    // clearInterval(this.interval);
    this.disconnect();
  }

  disconnect(silent: boolean = true) {
    silent || this.logger.warn('Disconnecting now...');
    this.source?.close();

    this.source = undefined;
  }

  connect(callback: Function, silent: boolean = true) {
    // Disconnect, if necessary
    if (this.source) {
      this.disconnect();
    }

    const token = this.token;
    if (token) {
      silent || this.logger.warn('Connecting now...');

      // Connect to SSE using the given parameters
      this.source = new EventSource(this.url, this.eventSourceParams);

      this.source.onerror = this.onError.bind(this);
      this.source.onopen = this.onOpen.bind(this);
      this.source.onmessage = (event: GirderEvent) => {
        callback(event);
      };
    } else {
      silent || this.logger.warn('No token, skipping connection...');
    }
  }

  onError(err: any) {
    if (!err || err.errorMessage === '') {
      return;
    }

    if (err.errorMessage || err.message) {
      this.logger.warn('Error received from EventSource:', err.errorMessage || err.message);
    } else {
      this.logger.error('Unknown error received from EventSource:', err);
    }
  }

  onOpen(ack: any) {
    this.logger.debug('Connection established:', ack);

    // Reconnect every ~30s to keep the connection open
    // XXX: This may be due to Girder not sending keep-alive bytes
    /*this.interval = setTimeout(() => {
      console.log('Attempting preemptive reconnection...');
      this.reconnect(true);
    }, NotificationStreamService.IntervalDelayMs);*/
  }
}

module NotificationStreamService {
  /**
   * Parameters for notificationStream
   */
  export interface NotificationStreamParams {
    /**
     * How far back should we search for events?
     */
    since?: number;

    /**
     * When should we terminate the connection
     * TODO: Is this based on inactivity? purely duration?
     */
    timeout?: number;

    /**
     * The auth token to use for this connection
     */
    token?: string;
  }
}

export { NotificationStreamService };
