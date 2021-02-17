import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from '@framework/core/log.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  readonly taleSubject = new Subject<string>();

  constructor(private readonly logger: LogService) {}

  taleUpdated(taleId: string): void {
    this.logger.info('Updating Tale via SyncService: ', taleId);
    this.taleSubject.next(taleId);
  }
  instanceUpdated(instanceId: string): void {
    this.logger.info('Updating Instance via SyncService: ', instanceId);
    this.taleSubject.next(instanceId);
  }
}
