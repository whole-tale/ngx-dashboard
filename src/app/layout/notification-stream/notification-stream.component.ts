import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventData } from '@api/events/event-data';
import { GirderEvent } from '@api/events/girder-event';
import { JobService } from '@api/services/job.service';
import { TokenService } from '@api/token.service';
import { LogService } from '@shared/core';
import { SyncService } from '@tales/sync.service';
import { EventSourcePolyfill as EventSource } from 'ng-event-source';

import { ViewLogsDialogComponent } from '../../shared/common/components/view-logs-dialog/view-logs-dialog.component';

import { NotificationStreamService } from './notification-stream.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-notification-stream',
  templateUrl: './notification-stream.component.html',
  styleUrls: ['./notification-stream.component.scss'],
})
export class NotificationStreamComponent implements OnInit {
  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly zone: NgZone,
    private readonly sync: SyncService,
    private readonly logger: LogService,
    private readonly dialog: MatDialog,
    private readonly notificationStream: NotificationStreamService,
    private readonly tokenService: TokenService,
    private readonly jobService: JobService
  ) {}

  ngOnInit(): void {
    this.tokenService.currentUser.subscribe(() => {
      if (this.tokenService.user.value) {
        this.notificationStream.connect(this.onMessage.bind(this), false);
      } else {
        this.notificationStream.disconnect();
      }
    });
  }

  get token(): string {
    return this.notificationStream.token;
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

  ackAll(): void {
    this.zone.run(() => {
      this.notificationStream.ackAll();
      this.ref.detectChanges();
    });
  }

  cancelJob(event: EventData): void {
    if (!event.data || !event.data || !event.data.resource || !event.data.resource.jobs || !event.data.resource.jobs.length) {
      this.logger.warn('Warning: Cannot cancel job without IDs');

      return;
    }

    const jobIds: Array<string> = event.data.resource.jobs;
    this.logger.debug(`Cancelling jobIds: ${jobIds}`);
    jobIds.forEach((jobId) => {
      this.jobService.jobCancelJob(jobId).subscribe((resp) => {
        this.logger.info(`Job cancelled: ${jobId}`);
      });
    });
  }

  onMessage(girderEvent: GirderEvent): void {
    // Discard everything outside of "data"
    const eventData: EventData = JSON.parse(girderEvent.data);
    const { affectedResourceIds, event } = eventData.data;

    // FIXME: this should use `eventData.type` instead, or adjust wt_progress + others
    // Handle resource-specific updates

    this.logger.info('Processing event: ', event);
    switch (event) {
      case 'wt_tale_updated':
        return this.sync.taleUpdated(affectedResourceIds.taleId);
      case 'wt_tale_created':
        return this.sync.taleCreated(affectedResourceIds.taleId);
      case 'wt_tale_removed':
        return this.sync.taleRemoved(affectedResourceIds.taleId);

      case 'wt_tale_shared':
        return this.sync.taleShared(affectedResourceIds.taleId);
      case 'wt_tale_unshared':
        return this.sync.taleUnshared(affectedResourceIds.taleId);

      case 'wt_import_started':
        return this.sync.taleImportStarted(affectedResourceIds.taleId);
      case 'wt_import_completed':
        return this.sync.taleImportCompleted(affectedResourceIds.taleId);
      case 'wt_import_failed':
        return this.sync.taleImportFailed(affectedResourceIds.taleId);

      case 'wt_instance_launching':
        return this.sync.instanceLaunching(affectedResourceIds.taleId, affectedResourceIds.instanceId);
      case 'wt_instance_running':
        return this.sync.instanceRunning(affectedResourceIds.taleId, affectedResourceIds.instanceId);
      case 'wt_instance_deleting':
        return this.sync.instanceDeleting(affectedResourceIds.taleId, affectedResourceIds.instanceId);
      case 'wt_instance_deleted':
        return this.sync.instanceDeleted(affectedResourceIds.taleId, affectedResourceIds.instanceId);
      case 'wt_instance_error':
        return this.sync.instanceError(affectedResourceIds.taleId, affectedResourceIds.instanceId);
      default:
        this.logger.info('Unrecognized update event: ', girderEvent.data);
        break;
    }

    // Ignore everything else except for progress updates
    if (eventData.type !== 'wt_progress') {
      this.logger.debug(`Skipping ignored event type (${eventData.type}):`, eventData);

      return;
    }

    this.logger.warn('Message received:', eventData);

    this.zone.run(() => {
      // Check for existing notifications matching this one
      const existing = this.events.find((evt) => eventData._id === evt._id);
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
          value: eventData.data.current,
        });
      });
    }

    // If task has related resources, attempt to update them too
    if (eventData.data.resource.type === 'wt_recorded_run') {
      return this.sync.taleUpdated(eventData.data.resource.tale_id);
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
      data: { jobIds },
    };

    const dialogRef = this.dialog.open(ViewLogsDialogComponent, config);
    // Do nothing on close
  }

  trackById(index: number, event: EventData): string {
    return event._id;
  }
}
