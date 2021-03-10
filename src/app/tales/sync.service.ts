import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from '@framework/core/log.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
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

  readonly instanceLaunchingSubject = new Subject<string>();
  readonly instanceRunningSubject = new Subject<string>();

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

  instanceLaunching(instanceId: string): void {
    this.logger.info('Updating Instance via SyncService: ', instanceId);
    this.delay(() => this.instanceLaunchingSubject.next(instanceId));
  }
  instanceRunning(instanceId: string): void {
    this.logger.info('Updating Instance via SyncService: ', instanceId);
    this.delay(() => this.instanceRunningSubject.next(instanceId));
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

  private delay(fn: Function, delayMs = 1000): void {
    setTimeout(fn, delayMs);
  }
}
