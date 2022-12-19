import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Job, PublishInfo, Repository, Tale, Version } from '@api/models';
import { JobService, RepositoryService, TaleService, VersionService } from '@api/services';
import { LogService } from '@shared/core';

// import * as $ from 'jquery';
declare var $: any;

const DEFAULT_PUBLISHING_MESSAGE = 'Publishing Tale...'

@Component({
  templateUrl: './publish-tale-dialog.component.html',
  styleUrls: ['./publish-tale-dialog.component.scss']
})
export class PublishTaleDialogComponent implements OnInit {
  repositories: Array<Repository> = [];
  selectedRepository = '';

  versions: Array<Version> = [];
  selectedVersion = '';

  publishStatus = 'init';
  lastMessage: string = DEFAULT_PUBLISHING_MESSAGE;
  progressTotal: number;
  progressCurrent: number;
  publishInfo: PublishInfo;

  interval: any;

  get selectedRepositoryName(): string {
     const repo = this.repositories.find(r => r.repository === this.selectedRepository);

     return repo ? repo.name : '';
  }

  constructor(
    private readonly zone: NgZone,
    private readonly repositoryService: RepositoryService,
    private readonly taleService: TaleService,
    private readonly jobService: JobService,
    private readonly versionService: VersionService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: { tale: Tale }) {

  }

  // FIXME: Duplicated code (see tale-metadata.component.ts)
  get latestPublish(): PublishInfo {
    if (!this.data.tale || !this.data.tale.publishInfo || !this.data.tale.publishInfo.length) {
      return undefined;
    }

    // Sort by date, then
    return this.data.tale.publishInfo.sort((a: PublishInfo, b: PublishInfo) => {
      // Example Format: "2019-01-23T15:48:17.476000+00:0"
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);
      if (dateA > dateB) { return 1; }
      if (dateA < dateB) { return -1; }

      return 0;
    }).slice(-1).pop();
  }

  ngOnInit(): void {
    $('.ui.dropdown').dropdown();

    this.repositoryService.repositoryListRepository().subscribe((repos: Array<Repository>) => {
      this.repositories = repos;
      this.logger.debug("Fetched repositories:", repos);

      if (!repos?.length) {
        this.logger.warn("No repositories configured.. prompting to route to settings:", repos);
      }
    });

    // TODO: is this a safe assumption?
    // this.selectedVersion = this.data.tale.restoredFrom;
    this.versionService.versionListVersions({ limit: 0, taleId: this.data.tale._id }).subscribe((versions: Array<Version>) => {
      this.versions = versions;
      this.logger.debug("Fetched versions:", versions);
      if (!versions?.length) {
        this.logger.warn("No Tale versions have been saved");
      }
    });
  }

  trackByRepository(index: number, repo: Repository): string {
    return repo.repository;
  }

  trackByVersion(index: number, version: Version): string {
    return version._id;
  }

  submitPublish(): void {
    const stopPolling = () => {
      clearInterval(this.interval);
      this.interval = undefined;
    };

    this.lastMessage = DEFAULT_PUBLISHING_MESSAGE;
    this.publishStatus = 'active';

    // Mock publishing
    this.interval = setTimeout(() => {
      stopPolling();
    }, 3000);

    // TODO: PUT /tale/publish
    const params = {
      version: this.selectedVersion,
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
              // this.lastMessage = 'Your Tale has been published successfully!';
              // Fetch Tale and display new publishInfo
              this.taleService.taleGetTale(this.data.tale._id).subscribe((tale: Tale) => {
                this.zone.run(() => {
                  if (tale.publishInfo.length > 0) {
                    this.data.tale.publishInfo = tale.publishInfo;
                  }
                });
              });

              if (this.interval) {
                stopPolling();
              }
            } else if (watched.status === 4) {
              if (this.interval) {
                stopPolling();
              }
              this.publishStatus = 'error';

              // Fetch final error message
              this.jobService.jobGetJobResult(watched._id).subscribe((lastMessage) => {
                this.lastMessage = lastMessage || 'Failed running publishing job - an unknown error has occurred. Please contact an administrator.';
              },
              (err) => {
                this.lastMessage = 'Failed running publishing job - an unknown error has occurred. Please contact an administrator.';
              });
            }

            // Poll / wait for launch
            // TODO: Fix edge cases (refresh, etc)


          }, (err: any) => {
            this.logger.error('Error polling for job status:', err);

            // Stop the polling if an error is hit
            stopPolling();

            this.zone.run(() => {
              this.publishStatus = 'error';
              this.lastMessage = err.error.message || 'Failed polling for job status';
            });
          });
        }, 500);
      });
    }, (err: any) => {
      this.logger.error("Failed to submit Tale for publishing:", err);
      this.publishStatus = 'error';
      this.lastMessage = err.error.message || 'Failed to submit publishing job';
    });
  }

  get docUrl(): string {
    return `${window.env.rtdBaseUrl}/users_guide/publishing.html`;
  }
}
