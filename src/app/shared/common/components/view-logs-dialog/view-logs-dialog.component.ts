import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Instance, Job } from '@api/models';
import { InstanceService, JobService } from '@api/services';
import { BehaviorSubject } from 'rxjs';

enum LogsType {
  Instance,
  JobList,
}

@Component({
  selector: 'app-view-logs-dialog',
  templateUrl: './view-logs-dialog.component.html',
  styleUrls: ['./view-logs-dialog.component.scss'],
})
export class ViewLogsDialogComponent implements OnInit, OnDestroy {
  logs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  refreshInterval = 5000;
  jobs: Array<Job> = [];
  intervals: Array<any> = [];
  stayAtBottom = true;
  fetching = true;

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly jobService: JobService,
    private readonly instanceService: InstanceService,
    @Inject(MAT_DIALOG_DATA) public data: { jobIds: Array<string>; instance: Instance }
  ) {}

  ngOnInit(): void {
    // If we're given an instanceId, render the logs ofr that instance only
    if (this.data.instance) {
      this.autoFetchInstanceLogs();

      return;
    }

    // Otherwise, assume that we're showing one or more logs for Job resource
    this.data.jobIds.forEach((jobId) => {
      this.jobService.jobGetJob(jobId).subscribe((job: Job) => {
        // Save this job and resort by created timestamp
        this.jobs.push(job);

        // Concatenate all logs together for display
        this.mergeLogs();
      });
    });
    const count = this.data.jobIds.length;
    const latestJob = this.data.jobIds.sort((a: string, b: string): number => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }

      return 0;
    })[count - 1];
    this.autoFetchJobLogs(latestJob);
  }

  shouldStayAtBottom(): boolean {
    return this.stayAtBottom;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const id = 'log-viewer-content';
      const logViewer = document.getElementById(id);
      logViewer.scrollTop = logViewer.scrollHeight;
    }, 200);
  }

  mergeLogs(): void {
    let logs = '';

    // Sort jobs by date/time
    this.jobs.sort((a: Job, b: Job): number => {
      if (a.created > b.created) {
        return 1;
      }
      if (a.created < b.created) {
        return -1;
      }

      return 0;
    });

    // Concatenate all logs together for display
    this.jobs.forEach((job: Job) => {
      logs += `${job.log.join('')}\n\n\n\n\n`;
    });

    const logsFound = !!logs.replace(/\w/g, '').trim();
    if (logsFound) {
      this.logs.next(logs);
    } else {
      this.logs.next(`No log data found for jobs with ID = ${this.jobs.map((j) => j._id)}`);
    }

    this.ref.detectChanges();
  }

  stopPolling(interval: any): void {
    if (interval) {
      this.intervals.splice(this.intervals.indexOf(interval), 1);
      clearInterval(interval);
    }
  }
  autoFetchInstanceLogs(intervalMs: number = this.refreshInterval): void {
    const interval: any = setInterval(() => {
      this.instanceService.instanceGetInstanceLogs(this.data.instance._id).subscribe(
        (logs: string) => {
          const logsFound = !!logs.replace(/\w/g, '').trim();
          if (logsFound) {
            // Print log messages, if any are found
            this.logs.next(logs);
          } else {
            // Print error message if instance logs are empty
            this.logs.next(`No log data found for instance with ID = ${this.data.instance._id}`);
          }
          this.ref.detectChanges();

          // If requested, keep scrolling at the bottom
          if (this.shouldStayAtBottom()) {
            this.scrollToBottom();
          }
        },
        (err) => {
          // Print error message if we failed to fetch instance logs
          this.logs.next(`Failed to fetch logs for instance with ID = ${this.data.instance._id}:\n${err?.message || err?.error || err}`);
        }
      );
    }, intervalMs);

    this.intervals.push(interval);
  }

  autoFetchJobLogs(jobId: string, intervalMs: number = this.refreshInterval): void {
    const interval: any = setInterval(() => {
      this.fetching = true;
      this.jobService.jobGetJob(jobId).subscribe(
        (job: Job) => {
          // If job is done, stop polling
          if (job.status === 3) {
            this.stopPolling(interval);
          }

          // Overwrite existing log data for this job
          const existing = this.jobs.find((j) => jobId === j._id);
          const index = this.jobs.indexOf(existing);
          this.jobs[index] = job;
          this.fetching = false;

          // Concatenate all logs together for display
          this.mergeLogs();

          // If requested, keep scrolling at the bottom
          if (this.shouldStayAtBottom()) {
            this.scrollToBottom();
          }
        },
        (err) => {
          this.logs.next(`No log data found for jobs with ID = ${this.jobs.map((j) => j._id)}:\n${err?.message || err?.error || err}`);
        }
      );
    }, intervalMs);

    this.intervals.push(interval);
  }

  ngOnDestroy(): void {
    this.intervals.forEach((interval: any) => {
      this.stopPolling(interval);
    });
  }
}
