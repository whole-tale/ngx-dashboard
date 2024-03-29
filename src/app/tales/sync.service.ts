import { Injectable } from '@angular/core';
import { LogService } from '@shared/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  readonly taleCreatedSubject = new Subject<string>();
  readonly taleUpdatedSubject = new Subject<string>();
  readonly taleSharedSubject = new Subject<string>();
  readonly taleUnsharedSubject = new Subject<string>();
  readonly taleRemovedSubject = new Subject<string>();

  readonly taleImportStartedSubject = new Subject<string>();
  readonly taleImportCompletedSubject = new Subject<string>();
  readonly taleImportFailedSubject = new Subject<string>();

  readonly instanceLaunchingSubject = new Subject<{ taleId: string; instanceId: string }>();
  readonly instanceRunningSubject = new Subject<{ taleId: string; instanceId: string }>();
  readonly instanceDeletingSubject = new Subject<{ taleId: string; instanceId: string }>();
  readonly instanceDeletedSubject = new Subject<{ taleId: string; instanceId: string }>();
  readonly instanceErrorSubject = new Subject<{ taleId: string; instanceId: string }>();

  constructor(private readonly logger: LogService) {}

  taleCreated(taleId: string): void {
    this.logger.info('Creating Tale via SyncService: ', taleId);
    this.delay(() => this.taleCreatedSubject.next(taleId));
  }
  taleUpdated(taleId: string): void {
    this.logger.info('Updating Tale via SyncService: ', taleId);
    this.delay(() => this.taleUpdatedSubject.next(taleId));
  }
  taleRemoved(taleId: string): void {
    this.logger.info('Removing Tale via SyncService: ', taleId);
    this.delay(() => this.taleRemovedSubject.next(taleId));
  }

  taleShared(taleId: string): void {
    this.logger.info('Sharing Tale via SyncService: ', taleId);
    this.delay(() => this.taleSharedSubject.next(taleId));
  }
  taleUnshared(taleId: string): void {
    this.logger.info('Unsharing Tale via SyncService: ', taleId);
    this.delay(() => this.taleUnsharedSubject.next(taleId));
  }

  instanceLaunching(taleId: string, instanceId: string): void {
    this.logger.info('Updating Instance (Launching) via SyncService: ', instanceId);
    this.delay(() => this.instanceLaunchingSubject.next({ taleId, instanceId }));
  }
  instanceRunning(taleId: string, instanceId: string): void {
    this.logger.info('Updating Instance (Running) via SyncService: ', instanceId);
    this.delay(() => this.instanceRunningSubject.next({ taleId, instanceId }));
  }
  instanceDeleting(taleId: string, instanceId: string): void {
    this.logger.info('Deleting Instance (Deleting) via SyncService: ', instanceId);
    this.delay(() => this.instanceDeletingSubject.next({ taleId, instanceId }));
  }
  instanceDeleted(taleId: string, instanceId: string): void {
    this.logger.info('Deleted Instance (Deleted) via SyncService: ', instanceId);
    this.delay(() => this.instanceDeletedSubject.next({ taleId, instanceId }));
  }
  instanceError(taleId: string, instanceId: string): void {
    this.logger.info('Updating Instance (Error) via SyncService: ', instanceId);
    this.delay(() => this.instanceErrorSubject.next({ taleId, instanceId }));
  }

  // TODO: Indicate Tale import state in UI
  taleImportStarted(taleId: string): void {
    this.logger.info('Importing Tale via SyncService: ', taleId);
    this.delay(() => this.taleImportStartedSubject.next(taleId));
  }
  taleImportCompleted(taleId: string): void {
    this.logger.info('Import completed via SyncService: ', taleId);
    this.delay(() => this.taleImportCompletedSubject.next(taleId));
  }
  taleImportFailed(taleId: string): void {
    this.logger.info('Import failed via SyncService: ', taleId);
    this.delay(() => this.taleImportFailedSubject.next(taleId));
  }

  delay(fn: Function, delayMs = 1000): void {
    setTimeout(fn, delayMs);
  }
}
