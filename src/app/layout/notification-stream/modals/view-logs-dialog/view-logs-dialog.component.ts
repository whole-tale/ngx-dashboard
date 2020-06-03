import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Job } from '@api/models/job';
import { JobService } from '@api/services/job.service';
import { LogService } from '@framework/core/log.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-view-logs-dialog',
  templateUrl: './view-logs-dialog.component.html',
  styleUrls: ['./view-logs-dialog.component.scss']
})
export class ViewLogsDialogComponent implements OnInit, OnDestroy {
  logs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  refreshInterval = 2000;
  interval: any;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly jobService: JobService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: { jobId: string }
  ) {}

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.jobService.jobGetJob(this.data.jobId).subscribe((job: Job) => {
        const logs = job.log.join('');
        this.logs.next(logs);
        this.ref.detectChanges();
      });
    }, this.refreshInterval);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
