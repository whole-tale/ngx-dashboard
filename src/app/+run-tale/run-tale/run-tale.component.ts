import { ChangeDetectorRef, Component, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfiguration } from '@api/api-configuration';
import { AccessLevel, Instance, Run, Tale, User, Version } from '@api/models';
import { InstanceService, RunService, TaleService, UserService, VersionService } from '@api/services';
import { TokenService } from '@api/token.service';
import { AlertModalComponent } from '@shared/common/components/alert-modal/alert-modal.component';
import { BaseComponent, LogService } from '@shared/core';
import { CollaboratorList } from '@tales/components/rendered-tale-metadata/rendered-tale-metadata.component';
import { TaleAuthor } from '@tales/models/tale-author';
import { SyncService } from '@tales/sync.service';
import { Subscription } from 'rxjs';
import { TaleVersionsPanelComponent } from '~/app/+run-tale/run-tale/tale-versions-panel/tale-versions-panel.component';
import { routeAnimation } from '~/app/shared';

import { ConnectGitRepoDialogComponent } from './modals/connect-git-repo-dialog/connect-git-repo-dialog.component';
import { PublishTaleDialogComponent } from './modals/publish-tale-dialog/publish-tale-dialog.component';

// import * as $ from 'jquery';
declare var $: any;

enum TaleExportFormat {
  ZIP = 'native',
  BagIt = 'bagit'
}

@Component({
    templateUrl: './run-tale.component.html',
    styleUrls: ['./run-tale.component.scss'],
    animations: [routeAnimation]
})
export class RunTaleComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild(TaleVersionsPanelComponent) versionsPanel: TaleVersionsPanelComponent;

    AccessLevel: any = AccessLevel;

    taleId: string;
    tale: Tale;
    instance: Instance;
    creator: User;
    currentTab = 'metadata';
    showVersionsPanel = false;
    fetching = false;

    collaborators: CollaboratorList = { users: [], groups: [] };

    removeSubscription:Subscription;
    updateSubscription: Subscription;
    taleUnsharedSubscription: Subscription;
    taleImportCompletedSubscription: Subscription;
    taleInstanceLaunchingSubscription: Subscription;
    taleInstanceRunningSubscription: Subscription;
    taleInstanceDeletedSubscription: Subscription;
    taleInstanceErrorSubscription: Subscription;

    constructor(
      private ref: ChangeDetectorRef,
      private zone: NgZone,
      private route: ActivatedRoute,
      private router: Router,
      private logger: LogService,
      private taleService: TaleService,
      private instanceService: InstanceService,
      private userService: UserService,
      public tokenService: TokenService,
      private versionService: VersionService,
      private runService: RunService,
      private syncService: SyncService,
      private config: ApiConfiguration,
      private dialog: MatDialog
    ) {
        super();
    }

    isVersionsPanelShown(): boolean {
      return this.showVersionsPanel;
    }

    isTaleWritable(): boolean {
      return this.tokenService?.user?.value ? this.tale._accessLevel >= AccessLevel.Write : false;
    }

    trackByAuthorOrcid(index: number, author: TaleAuthor): string {
        return author.orcid;
    }

    taleInstanceStateChanged(event: {tale: Tale, instance: Instance}): void {
      if (!event.tale) {
        return;
      } else if (event.tale._id === this.tale._id) {
        this.instance = event.instance;
      }
      this.ref.detectChanges();
    }

    toggleVersionsPanel(): void {
      this.showVersionsPanel = !this.showVersionsPanel;
    }

    taleVersionChanged(event: any): void {
      this.refresh();
    }

    get dashboardLink(): string {
      if (!this.tokenService.user.value) {
        return '/public';
      } else if (!this.tale || this.tale._accessLevel === AccessLevel.Admin) {
        return '/mine';
      } else if (this.tale._accessLevel === AccessLevel.None) {
        return '/public';
      } else if (this.tale._accessLevel === AccessLevel.Read || this.tale._accessLevel === AccessLevel.Write) {
        return '/shared';
      }
    }

    detectCurrentTab(): void {
      this.route.queryParams.subscribe(params => {
        const tab = params.tab;
        if (tab && tab !== this.currentTab) {
          this.switchTab(tab);
        }
      });
    }

    switchTab(tab: string): void {
      this.currentTab = tab;
      this.router.navigate(['run', this.taleId ], {
        queryParamsHandling: "merge",
        queryParams: { tab }
      });
    }

    isTabActive(tab: string): boolean {
      return this.currentTab === tab;
    }

    refreshCollaborators(): void {
      if (!this.tale || this.tale._accessLevel < AccessLevel.Write) {
        return;
      }

      this.taleService.taleGetTaleAccess(this.taleId).subscribe((resp: any) => {
        this.logger.info("Fetched collaborators:", resp);
        this.collaborators = resp;
        this.ref.detectChanges();

        return resp;
      });
    }

    refresh(): void {
      if (!this.taleId) {
        // TODO: redirect to catalog view?
        this.logger.error("No taleId given. Aborting.");

        return;
      }

      if (this.tokenService.user.value) {
        const params = { taleId: this.taleId };
        this.instanceService.instanceListInstances(params).subscribe((instances: Array<Instance>) => {
          const running = instances.filter(i => i.status !== 3);
          if (running.length > 0) {
            this.instance = running[0];
          }
        });
      }

      this.logger.debug(`Fetching tale with _id=${this.taleId}`);
      this.taleService.taleGetTale(this.taleId)
                      .subscribe((tale: Tale) => {
        this.logger.info("Fetched tale:", tale);
        this.tale = tale;

        this.refreshCollaborators();

        this.tokenService.currentUser.subscribe((user: User) => {
          if (!user && !this.tale.public) {
            this.router.navigate(['']);
          }
        });

        this.userService.userGetUser(this.tale.creatorId)
                      .subscribe(creator => {
          this.creator = creator;
          this.logger.info("Fetched creator:", this.creator);
          this.ref.detectChanges();

          // FIXME: Due to a timing issue, the Tale dropdown isn't present until tale is populated
          this.zone.runOutsideAngular(() => {
            setTimeout(() => {
              $('.ui.tale.dropdown').dropdown();
            }, 650);
          });
        });
      }, err => {
        this.logger.error("Failed to fetch creator user:", err);
      });
    }

    detectTaleId(): void {
      this.route.params.subscribe(params => {
          this.taleId = params.id;
          this.refresh();
      });
    }

    ngOnInit(): void {
      this.detectTaleId();
      this.detectCurrentTab();

      this.taleInstanceLaunchingSubscription = this.syncService.instanceLaunchingSubject.subscribe(this.updateInstance);
      this.taleInstanceRunningSubscription = this.syncService.instanceRunningSubject.subscribe(this.updateInstance);
      this.taleInstanceErrorSubscription = this.syncService.instanceErrorSubject.subscribe(this.updateInstance);

      this.taleInstanceDeletedSubscription = this.syncService.instanceDeletedSubject.subscribe((resource: {taleId: string, instanceId: string}) => {
        if (resource.taleId === this.taleId) {
          this.instance = undefined;
          this.ref.detectChanges();
        }
      });

      this.taleUnsharedSubscription = this.syncService.taleUnsharedSubject.subscribe((taleId) => {
        if (taleId === this.taleId) {
          // Update current collaborators list
          this.refreshCollaborators();

          this.taleService.taleGetTale(taleId).subscribe((tale: Tale) => {
            // Update the current access level
            this.tale._accessLevel = tale._accessLevel;
            this.ref.detectChanges();

            // If we can no longer view this Tale, redirect to the Catalog
            if (tale._accessLevel < AccessLevel.Read) {
              const returnRoute = this.tale ? this.dashboardLink : '/mine';
              const dialogRef = this.dialog.open(AlertModalComponent, { data: {
                title: 'Tale was unshared',
                content: [
                  'This Tale is no longer being shared with you.',
                  'You will be redirected back to the catalog.'
                ]
              }});
              dialogRef.afterClosed().subscribe((result: boolean) => {
                this.router.navigate([returnRoute]);
              });
            }
          },
          (err: any) => {
            this.logger.error("Failed to fetch Tale:", err);
            if (err.status === 403) {
              const returnRoute = this.tale ? this.dashboardLink : '/mine';
              const dialogRef = this.dialog.open(AlertModalComponent, { data: {
                title: 'Tale was unshared',
                content: [
                  'This Tale is no longer being shared with you.',
                  'You will be redirected back to the catalog.'
                ]
              }});
              dialogRef.afterClosed().subscribe((result: boolean) => {
                this.router.navigate([returnRoute]);
              });
            }
          });
        }
      });

      this.removeSubscription = this.syncService.taleRemovedSubject.subscribe((taleId) => {
        if (taleId === this.taleId) {
          const returnRoute = this.tale ? this.dashboardLink : '/mine';
          const dialogRef = this.dialog.open(AlertModalComponent, { data: {
            title: 'Tale was deleted',
            content: [
              'The Tale was removed by another user.',
              'You will be redirected back to the catalog.'
            ]
          }});
          dialogRef.afterClosed().subscribe((result: boolean) => {
            this.router.navigate([returnRoute]);
          });

          return;
        }
      });

      this.updateSubscription = this.syncService.taleUpdatedSubject.subscribe((taleId) => {
        this.logger.info("Tale update received from SyncService: ", taleId);
        if (taleId === this.taleId && !this.fetching) {
          this.fetching = true;
          setTimeout(() => {
            this.logger.info("Tale update applied via SyncService: ", taleId);
            this.refresh();
            this.fetching = false;
          }, 1000);
        }
      });

      this.taleImportCompletedSubscription = this.syncService.taleImportCompletedSubject.subscribe((taleId) => {
        if (taleId === this.taleId && !this.fetching) {
          this.fetching = true;
          setTimeout(() => {
            this.logger.info("Tale update applied after import via SyncService: ", taleId);
            this.refresh();
            this.fetching = false;
          }, 1000);
        }
      });
    }

    ngOnChanges(): void {
      this.detectTaleId();
      this.detectCurrentTab();
    }

    ngOnDestroy(): void {
      this.updateSubscription.unsubscribe();
      this.removeSubscription.unsubscribe();
      this.taleUnsharedSubscription.unsubscribe();
      this.taleImportCompletedSubscription.unsubscribe();
      this.taleInstanceLaunchingSubscription.unsubscribe();
      this.taleInstanceRunningSubscription.unsubscribe();
      this.taleInstanceDeletedSubscription.unsubscribe();
      this.taleInstanceErrorSubscription.unsubscribe();
    }

    updateInstance(resource: {taleId: string, instanceId: string}): void {
      if (resource.taleId === this.taleId) {
        this.instanceService.instanceGetInstance(resource.instanceId).subscribe((instance: Instance) => {
          this.instance = instance;
          this.ref.detectChanges();
        });
      }
    }

    performRecordedRun(): void {
      return this.versionsPanel.performRecordedRun();
    }

    saveTaleVersion(): void {
      this.logger.debug('Saving Tale version');
      this.versionService.versionCreateVersion({ taleId: this.taleId, force: true }).subscribe((version: Version) => {
        this.logger.debug("Version saved successfully:", version);
        this.taleService.taleRestoreVersion(this.taleId, version._id);
      });
    }

    openConnectGitRepoDialog(): void {
      const config = {
        data: { tale: this.tale }
      };
      const dialogRef = this.dialog.open(ConnectGitRepoDialogComponent, config);
      dialogRef.afterClosed().subscribe((gitRepo: string) => {
        if (!gitRepo) { return; }

        const taleId = this.taleId;
        this.taleService.taleUpdateGit(taleId, gitRepo).subscribe(resp => {
          this.logger.info(`Git repo added to ${taleId}:`, gitRepo);
        });
      });
    }

    rebuildTale(): void {
      const params = { id: this.tale._id };
      this.taleService.taleBuildImage(params).subscribe(res => {
        this.logger.debug("Tale building:", res);
      });
    }

    restartTale(): void {
      if (!this.instance) {
        this.logger.error("Cannot restart instance - instance does not exist or is not running:", this.instance);

        return;
      }

      const params = { taleId: this.tale._id };
      this.instanceService.instanceUpdateInstance(this.instance._id).subscribe(res => {
        this.logger.debug("Tale instance updated:", res);
      });
    }

    copyTale(): void {
      this.taleService.taleCopyTale(this.tale._id).subscribe(res => {
        this.logger.debug("Cloning entire Tale (including versions):", res);
      });
    }

    // Expected parameter format:
    //    dataMap: [{"name":"Elevation per SASAP region and Hydrolic Unit (HUC8) boundary for Alaskan watersheds","dataId":"resource_map_doi:10.5063/F1Z60M87","repository":"DataONE","doi":"10.5063/F1Z60M87","size":10293583}]
    openPublishTaleDialog(event: Event): void {
      const config = {
        data: { tale: this.tale }
      };
      const dialogRef = this.dialog.open(PublishTaleDialogComponent, config);

      // Don't do anything on close
    }

    viewFullScreen(): void {
      const e: any = document.documentElement;
      const methodToBeInvoked = e.requestFullscreen || e.webkitRequestFullScreen || e.mozRequestFullscreen || e.msRequestFullscreen;
      if (methodToBeInvoked) {
        methodToBeInvoked.call(e);
      }
    }

    gotoDocs(): void {
      window.open(`${window.env.rtdBaseUrl}/users_guide/run.html`, '_blank');
    }

    exportTale(format: TaleExportFormat = TaleExportFormat.BagIt): void {
      const token = this.tokenService.getToken();
      const url = `${this.config.rootUrl}/tale/${this.tale._id}/export?token=${token}&taleFormat=${format}`;
      window.open(url, '_blank');
    }
}
