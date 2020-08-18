/* tslint:disable */
import { Injectable, OnDestroy } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';

import { TokenService } from '@api/token.service';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass';

@Injectable({
  providedIn: 'root'
})
class NotificationStreamService implements OnDestroy {
  static readonly Path = '/notification/stream';
  static readonly TimeoutMs = 360000;
  static readonly IntervalDelayMs = 30000;

  interval: any;

  source: EventSource;
  events: Array<any> = [];

  showNotificationStream = false;

  ackAll() {
    const newSince = new Date().getTime() / 1000;
    this.setSince(newSince);
    //this.reconnect(true);
    //this.connect();
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

  setSince(lastRead: number): void {
    // number -> string to conform to localStorage
    localStorage.setItem('lastRead', lastRead.toFixed().toString());
  }
  getSince(): number {
    // The leading "+" converts the value to a number
    return +localStorage.getItem('lastRead');
  }

  get token() {
    return this.tokenService.getToken();
  }

  get url() {
    let url = this.config.rootUrl + NotificationStreamService.Path;

    // TODO: Add query-string parameters
    let since = this.getSince();
    if (since) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + `since=${since}`;
    }

    let timeout = NotificationStreamService.TimeoutMs;
    if (timeout) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + `timeout=${timeout}`;
    }

    return url;
  }

  constructor(private config: ApiConfiguration, private tokenService: TokenService) {
    this.connect();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.disconnect();
  }

  disconnect() {
    if (this.source) {
      this.source.close();
    }
  }

  connect() {
    // Disconnect, if necessary
    this.disconnect();

    // Connect to SSE using the given parameters
    this.source = new EventSource(this.url, { headers: { 'Girder-Token': this.token } });

    this.source.onerror = this.onError.bind(this);
    this.source.onopen = this.onOpen.bind(this);
  }

  reconnect(silent: boolean = false) {
    silent || console.log('Reconnecting now...');
    this.disconnect();
    this.connect();
    silent || console.log('Reconnected.');
  }

  onError(err: any) {
    console.error('Error received from EventSource:', err);
  }

  onOpen(ack: any) {
    console.log('Connection established:', ack);

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
