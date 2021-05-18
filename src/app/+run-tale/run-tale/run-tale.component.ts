import { ChangeDetectorRef, Component, NgZone, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfiguration } from '@api/api-configuration';
import { AccessLevel } from '@api/models/access-level';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { InstanceService } from '@api/services/instance.service';
import { TaleService } from '@api/services/tale.service';
import { UserService } from '@api/services/user.service';
import { VersionService } from '@api/services/version.service';
import { TokenService } from '@api/token.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { WindowService } from '@framework/core/window.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { TaleAuthor } from '@tales/models/tale-author';
import { routeAnimation } from '~/app/shared';
import { SyncService } from '@tales/sync.service';
import { Subscription } from 'rxjs';

import { ConnectGitRepoDialogComponent } from './modals/connect-git-repo-dialog/connect-git-repo-dialog.component';
import { PublishTaleDialogComponent } from './modals/publish-tale-dialog/publish-tale-dialog.component';
import { AlertModalComponent } from '@shared/common/components/alert-modal/alert-modal.component';

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
    AccessLevel: any = AccessLevel;

    taleId: string;
    tale: Tale;
    instance: Instance;
    creator: User;
    currentTab = 'metadata';
    showVersionsPanel = false;
    fetching = false;

    collaborators: { users: Array<User>, groups: Array<User> } = { users: [], groups: [] };

    removeSubscription:Subscription;
    subscription: Subscription;
    taleUnsharedSubscription: Subscription;
    taleInstanceLaunchingSubscription: Subscription;
    taleInstanceRunningSubscription: Subscription;
    taleInstanceDeletedSubscription: Subscription;
    taleInstanceErrorSubscription: Subscription;

    constructor(
      private ref: ChangeDetectorRef,
      private zone: NgZone,
      private route: ActivatedRoute,
      private router: Router,
      private windowService: WindowService,
      private logger: LogService,
      private taleService: TaleService,
      private instanceService: InstanceService,
      private userService: UserService,
      private tokenService: TokenService,
      private versionService: VersionService,
      private syncService: SyncService,
      private config: ApiConfiguration,
      private dialog: MatDialog
    ) {
        super();
    }

    isVersionsPanelShown() :boolean {
      return this.showVersionsPanel;
    }

    isTaleWritable() :boolean {
      return this.tale._accessLevel >= AccessLevel.Write;
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
      if (!this.tale || this.tale._accessLevel === AccessLevel.Admin) {
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

    refreshCollaborators(): Promise<any> {
      return this.taleService.taleGetTaleAccess(this.taleId).toPromise().then((resp: any) => {
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

      const params = { taleId: this.taleId };
      this.instanceService.instanceListInstances(params).subscribe((instances: Array<Instance>) => {
        const running = instances.filter(i => i.status !== 3);
        if (running.length > 0) {
          this.instance = running[0];
        }
      });

      this.logger.debug(`Fetching tale with _id=${this.taleId}`);
      this.taleService.taleGetTale(this.taleId)
                      .subscribe((tale: Tale) => {
        if (!tale) {
          this.logger.error("Tale is null, something went horribly wrong");
          this.router.navigate(['mine']);

          return;
        }

        this.logger.info("Fetched tale:", tale);
        this.tale = tale;
        if (this.tale._accessLevel >= AccessLevel.Admin) {
          this.refreshCollaborators();
        }

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
        this.logger.error("Failed to fetch tale:", err);
        this.router.navigate(['mine']);
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

      this.taleInstanceLaunchingSubscription = this.syncService.instanceLaunchingSubject.subscribe((resource: {taleId: string, instanceId: string}) => {
        if (resource.taleId === this.taleId) {
          this.instanceService.instanceGetInstance(resource.instanceId).subscribe((instance: Instance) => {
            this.instance = instance;
            this.ref.detectChanges();
          });
        }
      });

      this.taleInstanceRunningSubscription = this.syncService.instanceRunningSubject.subscribe((resource: {taleId: string, instanceId: string}) => {
        if (resource.taleId === this.taleId) {
          this.instanceService.instanceGetInstance(resource.instanceId).subscribe((instance: Instance) => {
            this.instance = instance;
            this.ref.detectChanges();
          });
        }
      });

      this.taleInstanceErrorSubscription = this.syncService.instanceErrorSubject.subscribe((resource: {taleId: string, instanceId: string}) => {
        if (resource.taleId === this.taleId) {
          this.instanceService.instanceGetInstance(resource.instanceId).subscribe((instance: Instance) => {
            this.instance = instance;
            this.ref.detectChanges();
          });
        }
      });

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

      this.subscription = this.syncService.taleUpdatedSubject.subscribe((taleId) => {
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
    }

    ngOnChanges(): void {
      this.detectTaleId();
      this.detectCurrentTab();
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
      this.removeSubscription.unsubscribe();
      this.taleUnsharedSubscription.unsubscribe();
      this.taleInstanceLaunchingSubscription.unsubscribe();
      this.taleInstanceRunningSubscription.unsubscribe();
      this.taleInstanceDeletedSubscription.unsubscribe();
      this.taleInstanceErrorSubscription.unsubscribe();
    }

    performRecordedRun(): void {
      this.logger.debug('Performing recorded run');
    }

    saveTaleVersion(): void {
      this.logger.debug('Saving Tale version');
      this.versionService.versionCreateVersion({ taleId: this.taleId, force: true }).subscribe(version => {
        this.logger.debug("Version saved successfully:", version);
      });
    }

    openConnectGitRepoDialog(): void {
      const config: MatDialogConfig = {
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
        this.logger.debug("Tale copying:", res);
      });
    }


    // Expected parameter format:
    //    dataMap: [{"name":"Elevation per SASAP region and Hydrolic Unit (HUC8) boundary for Alaskan watersheds","dataId":"resource_map_doi:10.5063/F1Z60M87","repository":"DataONE","doi":"10.5063/F1Z60M87","size":10293583}]
    openPublishTaleDialog(event: Event): void {
      const config: MatDialogConfig = {
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
      this.windowService.open(this.windowService.env.rtdBaseUrl + '/users_guide/run.html', '_blank');
    }

    exportTale(format: TaleExportFormat = TaleExportFormat.BagIt): void {
      const token = this.tokenService.getToken();
      const url = `${this.config.rootUrl}/tale/${this.tale._id}/export?token=${token}&taleFormat=${format}`;
      this.windowService.open(url, '_blank');
    }
}
