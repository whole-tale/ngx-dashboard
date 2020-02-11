import { ChangeDetectorRef, Component } from '@angular/core';
import { NotificationStreamService } from '@api/notification-stream.service';
import { LogService } from '@framework/core/log.service';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';
import { BehaviorSubject } from 'rxjs';

// import * as $ from 'jquery';
declare var $: any;

// NOTE: "Event" is already a built-in type name
interface GirderEvent {
  // Error details
  errorCode: number;
  errorMessage: string;

  target: {}; // The EventSource that received this message
  data: string; // JSON.stringified EventData (see below)
  type: string; // Girder message type (e.g. "message")
}

interface EventData {
  // ID of this message
  _id: string;

  // Current time on the Girder server
  _girderTime: number;

  // Type of the message (we are only interested in type=="wt_progress")
  type: string;

  // Who is this message for?
  userId: string;

  // Timing attributes for this message
  startTime: number;
  expires: Date;
  time: Date;
  updated: Date;
  updatedTime: number;

  // Data payload for the message
  data: {
    // Message payload
    state: string; // status of the overall operation
    title: string; // unused - effectively a friendly job name= (e.g. "Creating instance")

    // Progress indication
    current: number; // Current step number
    total: number; // Total step number
    message: string; // Step progress message

    // Time indication
    estimateTime: boolean; // True if a time estimate is provided

    // Our custom resource, which includes associated IDs relevant to this message
    resourceName: string;
    resource: {
      instance_id?: string; // ID of the Instance for which this message is relevant
      jobs?: Array<string>; // Job IDs associated with this progress update
      tale_id?: string; // ID of the Tale for which this message is relevant
      tale_title?: string; // Title of the Tale
      type?: string; // WT job name (e.g. "wt_create_instance")
    };
  };
}

@Component({
  selector: 'app-notification-stream',
  templateUrl: './notification-stream.component.html',
  styleUrls: ['./notification-stream.component.scss']
})
export class NotificationStreamComponent {
  events: BehaviorSubject<Array<EventData>>;
  source: EventSource;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly logger: LogService,
    readonly notificationStream: NotificationStreamService
  ) {
    this.events = new BehaviorSubject<Array<EventData>>(this.notificationStream.events);
    this.source = this.notificationStream.source;

    if (this.source) {
      this.source.onmessage = (event: GirderEvent) => {
        this.onMessage.call(this, event);
      };
    }
  }

  onMessage(event: GirderEvent): void {
    // Discard everything outside of "data"
    const eventData: EventData = JSON.parse(event.data);

    // Ignore everything except for progress updates
    if (eventData.type !== 'wt_progress') {
      this.logger.debug(`Skipping ignored event type (${eventData.type}):`, eventData);

      return;
    }

    this.logger.warn('Message received:', eventData);

    // Check for existing notifications matching this one
    const events = this.events.value;
    const existing = events.find(evt => eventData._id === evt._id);
    if (!existing) {
      // If we haven't seen one like this, then display it
      events.push(eventData);
      this.notificationStream.openNotificationStream(true);
      this.events.next(events);
    } else if (existing && existing.updated < eventData.updated) {
      // Replace existing notification with newer updates
      const index = events.indexOf(existing);
      events[index] = eventData;
      this.events.next(events);
    }

    // If task is active, update progress
    if (eventData.data.state === 'active') {
      $(`#event-progress-${eventData._id}`).progress({
        total: eventData.data.total,
        value: eventData.data.current
      });
    }

    this.ref.detectChanges();
  }

  trackById(index: number, event: EventData): string {
    return event._id;
  }
}
