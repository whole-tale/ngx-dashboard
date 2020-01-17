import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account } from '@api/models/account';
import { Job } from '@api/models/job';
import { Repository } from '@api/models/repository';
import { PublishInfo } from '@api/models/publish-info';
import { Tale } from '@api/models/tale';
import { JobService } from '@api/services/job.service';
import { RepositoryService } from '@api/services/repository.service';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@framework/core/log.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './publish-tale-dialog.component.html',
  styleUrls: ['./publish-tale-dialog.component.scss']
})
export class PublishTaleDialogComponent implements OnInit {
  repositories: Array<Repository> = [];
  selectedRepository: string;
  
  get selectedRepositoryName() {
     return this.repositories.find(r => r.repository === this.selectedRepository).name;
  }
  
  publishStatus = 'init';
  lastMessage: string;
  progressTotal: number;
  progressCurrent: number;
  publishInfo: PublishInfo;
  
  interval: any;
  
  constructor(
    private readonly zone: NgZone,
    private readonly repositoryService: RepositoryService,
    private readonly taleService: TaleService,
    private readonly jobService: JobService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: { tale: Tale }) {
    
  }
  
  ngOnInit(): void {
    this.repositoryService.repositoryListRepository().subscribe((repos: Array<Repository>) => {
      this.repositories = repos;
      this.logger.info("Fetched repositories:", repos);
    });
  }
  
  trackByRepository(index: number, repo: Repository): string {
    return repo.repository;
  }
  
  submitPublish(): void {
    const stopPolling = () => {
      clearInterval(this.interval);
      this.interval = undefined;
    };
    
    this.publishStatus = 'active';
    
    // Mock publishing
    this.interval = setTimeout(() => {
      stopPolling();
    }, 3000);
    
    // TODO: PUT /tale/publish
    const params = { 
      repository: this.selectedRepository,
      id: this.data.tale._id
    };
    this.taleService.talePublishTale(params).subscribe((job: Job) => {
    
      this.zone.run(() => {
        this.logger.info("Successfully submitted Tale for publishing:", job);
        
        if (this.interval) {
          stopPolling();
        }
        
        // Poll for job status, update progress
        this.interval = setInterval(() => {
          this.jobService.jobGetJob(job._id).subscribe((watched: Job) => {
            if (watched.progress) {
              this.zone.run(() => {
                $(`#publish-progress`).progress({
                  total: watched.progress.total,
                  value: watched.progress.current
                });
                this.lastMessage = watched.progress.message;
              });
            }
            
            // Wait for job status to be success or error
            if (watched.status === 3 ) {
              this.publishStatus = 'success';
              //this.lastMessage = 'Your Tale has been published successfully!';
              // TODO: Fetch Tale and display new publishInfo
              this.taleService.taleGetTale(this.data.tale._id).subscribe((tale: Tale) => {
                this.zone.run(() => {
                  if (tale.publishInfo.length > 0) {
                    this.publishInfo = tale.publishInfo[0];
                  }
                });
              });
              
              if (this.interval) {
                stopPolling();
              }
            } else if (watched.status === 4) {
              this.publishStatus = 'error';
              // TODO: Fetch final error message
              //this.lastMessage = 'Failed running job - see job logs for details';
              
              if (this.interval) {
                stopPolling();
              }
            }
            
            // Poll / wait for launch
            // TODO: Fix edge cases (refresh, etc)
                        
  
          }, (err: any) => {
            this.logger.error('Error polling for job status:', err);

            // Stop the polling if an error is hit
            stopPolling();
            
            this.zone.run(() => {
              this.publishStatus = 'error';
              this.lastMessage = 'Failed polling for job status';
            });
          });
        }, 500);
      });
    }, (err: any) => {
      this.logger.error("Failed to submit Tale for publishing:", err);
      this.publishStatus = 'error';
      this.lastMessage = 'Failed to submit publishing job';
    });
  }
}
