import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventData } from '@api/events/event-data';
import { GirderEvent } from '@api/events/girder-event';
import { Job } from '@api/models/job';
import { LogService } from '@framework/core/log.service';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';
import { BehaviorSubject } from 'rxjs';

import { ViewLogsDialogComponent } from './modals/view-logs-dialog/view-logs-dialog.component';
import { NotificationStreamService } from './notification-stream.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-notification-stream',
  templateUrl: './notification-stream.component.html',
  styleUrls: ['./notification-stream.component.scss']
})
export class NotificationStreamComponent {
  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly zone: NgZone,
    private readonly logger: LogService,
    private readonly dialog: MatDialog,
    private readonly notificationStream: NotificationStreamService
  ) {
    if (this.source) {
      this.source.onmessage = (event: GirderEvent) => {
        this.onMessage.call(this, event);
      };
    }
  }

  get source(): EventSource {
    return this.notificationStream.source;
  }

  get events(): Array<EventData> {
    return this.notificationStream.events;
  }

  get eventCount(): Number {
    if (!this.events) {
      return 0;
    }
    return this.events.length;
  }

  get showNotificationStream(): Boolean {
    return this.notificationStream.showNotificationStream;
  }

  ackAll() {
    this.zone.run(() => {
      this.notificationStream.ackAll();
      this.ref.detectChanges();
    });
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

    this.zone.run(() => {
      // Check for existing notifications matching this one
      const existing = this.events.find(evt => eventData._id === evt._id);
      if (!existing) {
        // If we haven't seen one like this, then display it
        this.notificationStream.events.push(eventData);
        this.notificationStream.openNotificationStream(true);
        // this.events.next(events);
      } else if (existing && existing.updated < eventData.updated) {
        // Replace existing notification with newer updates
        const index = this.events.indexOf(existing);
        this.events[index] = eventData;
        // this.events.next(events);
      }
    });

    // If task is active, update progress
    if (eventData.data.state === 'active') {
      this.zone.runOutsideAngular(() => {
        $(`#event-progress-${eventData._id}`).progress({
          total: eventData.data.total,
          value: eventData.data.current
        });
      });
    }

    this.ref.detectChanges();
  }

  openLogViewerModal(event: EventData): void {
    if (!event || !event.data || !event.data.resource || !event.data.resource.jobs || !event.data.resource.jobs.length) {
      this.logger.error('Failed to view logs - no jobId provided by event.');
      return;
    }

    // Grab first (build) jobId
    const jobIds = event.data.resource.jobs;
    const config: MatDialogConfig = {
      data: { jobIds }
    };

    const dialogRef = this.dialog.open(ViewLogsDialogComponent, config);
    // Do nothing on close
  }

  trackById(index: number, event: EventData): string {
    return event._id;
  }
}
