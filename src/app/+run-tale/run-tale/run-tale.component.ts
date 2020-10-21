import { ChangeDetectorRef, Component, NgZone, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { InstanceService } from '@api/services/instance.service';
import { TaleService } from '@api/services/tale.service';
import { UserService } from '@api/services/user.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { WindowService } from '@framework/core/window.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { TaleAuthor } from '@tales/models/tale-author';
import { routeAnimation } from '~/app/shared';

import { ApiConfiguration } from '@api/api-configuration';
import { TokenService } from '@api/token.service';
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
export class RunTaleComponent extends BaseComponent implements OnInit, OnChanges {
    taleId: string;
    tale: Tale;
    instance: Instance;
    creator: User;
    currentTab = 'metadata';

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
      private config: ApiConfiguration,
      private dialog: MatDialog
    ) {
        super();
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
                      .subscribe(tale => {
        if (!tale) {
          this.logger.error("Tale is null, something went horribly wrong");

          return;
        }

        this.tale = tale;
        this.logger.info("Fetched tale:", this.tale);

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
    }

    ngOnChanges(): void {
      this.detectTaleId();
      this.detectCurrentTab();
    }

    performRecordedRun() {
      console.log('Performing recorded run');
    }

    saveTaleVersion() {
      console.log('Saving Tale version');
    }

    openConnectGitRepoDialog() {
      console.log('Connecting Git repo');
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
      // TODO: how to avoid hard-coding this link?
      this.windowService.location.href = "https://wholetale.readthedocs.io/en/stable/users_guide/run.html";
    }

    exportTale(format: TaleExportFormat = TaleExportFormat.BagIt): void {
      const token = this.tokenService.getToken();
      const url = `${this.config.rootUrl}/tale/${this.tale._id}/export?token=${token}&taleFormat=${format}`;
      this.windowService.open(url, '_blank');
    }
}
