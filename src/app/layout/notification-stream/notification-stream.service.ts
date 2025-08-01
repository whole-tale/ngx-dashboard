/* tslint:disable */
import { Injectable, OnDestroy } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { GirderEvent } from '@api/events/girder-event';
import { LogService } from '@shared/core';

import { TokenService } from '@api/token.service';
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass';

@Injectable({
  providedIn: 'root',
})
class NotificationStreamService implements OnDestroy {
  static readonly Path = '/notifications/me';
  static readonly TimeoutMs = 85;

  source: WebSocket;
  events: Array<any> = [];

  showNotificationStream = false;

  ackAll() {
    const newSince = new Date().getTime() / 1000;
    this.openNotificationStream(false);
    this.events = [];
  }

  ackOne(evt: GirderEvent) {
    // TODO: How to prevent event from redispaying on page load?

    // Remove event from the list to hide it temporarily
    const index = this.events.indexOf(evt);
    this.events.splice(index, 1);
  }

  openNotificationStream(open: boolean = true) {
    this.showNotificationStream = open;
  }

  get token() {
    return this.tokenService.getToken();
  }

  get url() {
    let rootUrl = this.config.rootUrl.replace('/api/v1', '').replace('https://', 'wss://');
    let url = rootUrl + NotificationStreamService.Path + `?token=${this.token}`;
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
      this.source = new WebSocket(this.url);

      this.source.onerror = this.onError.bind(this);
      this.source.onopen = this.onOpen.bind(this);
      this.source.onmessage = (ev: MessageEvent) => {
        const girderEvent: GirderEvent = JSON.parse(ev.data);
        callback(girderEvent);
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
  }
}

module NotificationStreamService {
  /**
   * Parameters for notificationStream
   */
  export interface NotificationStreamParams {
    /**
     * The auth token to use for this connection
     */
    token?: string;
  }
}

export { NotificationStreamService };
