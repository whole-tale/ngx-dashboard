import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
export class ViewLogsDialogComponent implements OnInit {
  logs: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private readonly ref: ChangeDetectorRef,
    private readonly jobService: JobService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: { latestJobId: string }
  ) {}

  ngOnInit(): void {
    this.jobService.jobGetJob(this.data.latestJobId).subscribe((job: Job) => {
      const logs = job.log.join('');
      this.logs.next(logs);
      this.ref.detectChanges();
    });
  }
}
