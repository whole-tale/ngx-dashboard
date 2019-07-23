import { Component, NgZone } from '@angular/core';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';

import { NotificationStreamService } from '@api/notification-stream.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'notification-stream',
  templateUrl: './notification-stream.component.html',
  styleUrls: ['./notification-stream.component.scss']
})
export class NotificationStreamComponent {
  events: Array<any>;
  source: EventSource;

  constructor(private readonly zone: NgZone, private readonly notificationStream: NotificationStreamService) {
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

  onMessage(event: any) {
    // Discard everything outside of "data"
    event = JSON.parse(event.data);

    // Ignore everything except for progress updates
    if (event.type !== 'wt_progress') {
      console.log(`Skipping ignored event type (${event.type}):`, event);
      return;
    }

    console.log('Message received:', event);

    // Check for existing notifications matching this one
    const existing = this.events.find(evt => event._id === evt._id);
    if (!existing) {
      // If we haven't seen one like this, then display it
      this.zone.run(() => {
        this.events.push(event);
        this.notificationStream.openNotificationStream(true);
      });
    } else if (existing && existing.updated < event.updated) {
      // Replace existing notification with newer updates
      this.zone.run(() => {
        const index = this.events.indexOf(existing);
        this.events[index] = event;
      });
    }

    // If task is active, update progress
    if (event.data.state === 'active') {
      this.zone.run(() => {
        $('#event-progress-' + event._id).progress({
          total: event.data.total,
          value: event.data.current
        });
      });
    }

    // data-value="{{ event.data.current }}" data-total="{{ event.data.total }}"
  }

  trackById(index: number, event: any): string {
    return event._id;
  }
}
