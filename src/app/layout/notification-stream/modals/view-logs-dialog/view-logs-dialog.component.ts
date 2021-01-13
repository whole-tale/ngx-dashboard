import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Job } from '@api/models/job';
import { JobService } from '@api/services/job.service';
import { LogService } from '@framework/core/log.service';
import { BehaviorSubject, zip } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

@Component({
  selector: 'app-view-logs-dialog',
  templateUrl: './view-logs-dialog.component.html',
  styleUrls: ['./view-logs-dialog.component.scss']
})
export class ViewLogsDialogComponent implements OnInit, OnDestroy {
  logs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  refreshInterval = 2000;
  jobs: Array<Job> = [];
  intervals: Array<any> = [];

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly jobService: JobService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: { jobIds: Array<string> }
  ) {}

  ngOnInit(): void {
    this.data.jobIds.forEach(jobId => {
      this.jobService.jobGetJob(jobId).subscribe((job: Job) => {
        // Save this job and resort by created timestamp
        this.jobs.push(job);

        // Concatenate all logs together for display
        this.mergeLogs();
      });
    });
    const count = this.data.jobIds.length;
    const latestJob = this.data.jobIds[count - 1];
    this.autoFetch(latestJob);
  }

  mergeLogs(): void {
    let logs = '';

    // Sort jobs by date/time
    this.jobs.sort(
      (a: Job, b: Job): number => {
        if (a.created > b.created) {
          return 1;
        }
        if (a.created < b.created) {
          return -1;
        }

        return 0;
      }
    );

    // Concatenate all logs together for display
    this.jobs.forEach((job: Job) => {
      logs += `${job.log.join('')}\n\n\n\n\n`;
    });

    this.logs.next(logs);
    this.ref.detectChanges();
  }

  stopPolling(interval: any): void {
    if (interval) {
      this.intervals.splice(this.intervals.indexOf(interval), 1);
      clearInterval(interval);
    }
  }

  autoFetch(jobId: string, intervalMs: number = this.refreshInterval): void {
    const interval: any = setInterval(() => {
      this.jobService.jobGetJob(jobId).subscribe((job: Job) => {
        // If job is done, stop polling
        if (job.status === 3) {
          this.stopPolling(interval);
        }

        // Overwrite existing log data for this job
        const existing = this.jobs.find(j => jobId === j._id);
        const index = this.jobs.indexOf(existing);
        this.jobs[index] = job;

        // Concatenate all logs together for display
        this.mergeLogs();
      });
    }, intervalMs);

    this.intervals.push(interval);
  }

  ngOnDestroy(): void {
    this.intervals.forEach((interval: any) => {
      this.stopPolling(interval);
    });
  }
}
