import { Component, NgZone } from '@angular/core';
import { NotificationStreamService } from '@api/notification-stream.service';
import { LogService } from '@framework/core/log.service';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-notification-stream',
  templateUrl: './notification-stream.component.html',
  styleUrls: ['./notification-stream.component.scss']
})
export class NotificationStreamComponent {
  events: Array<any>;
  source: EventSource;

  constructor(
    private readonly zone: NgZone,
    private readonly logger: LogService,
    private readonly notificationStream: NotificationStreamService
  ) {
    this.events = this.notificationStream.events;
    this.source = this.notificationStream.source;

    if (this.source) {
      this.source.onmessage = event => {
        this.zone.run(() => {
          this.onMessage.call(this, event);
        });
      };
    }
  }

  onMessage(event: any): void {
    // Discard everything outside of "data"
    const eventData = JSON.parse(event.data);

    // Ignore everything except for progress updates
    if (eventData.type !== 'wt_progress') {
      this.logger.debug(`Skipping ignored event type (${eventData.type}):`, eventData);

      return;
    }

    this.logger.debug('Message received:', eventData);

    // Check for existing notifications matching this one
    const existing = this.events.find(evt => eventData._id === evt._id);
    if (!existing) {
      // If we haven't seen one like this, then display it
      this.zone.run(() => {
        this.events.push(eventData);
        this.notificationStream.openNotificationStream(true);
      });
    } else if (existing && existing.updated < eventData.updated) {
      // Replace existing notification with newer updates
      this.zone.run(() => {
        const index = this.events.indexOf(existing);
        this.events[index] = eventData;
      });
    }

    // If task is active, update progress
    if (eventData.data.state === 'active') {
      this.zone.run(() => {
        $(`#event-progress-${eventData._id}`).progress({
          total: eventData.data.total,
          value: eventData.data.current
        });
      });
    }
  }

  trackById(index: number, event: any): string {
    return event._id;
  }
}
