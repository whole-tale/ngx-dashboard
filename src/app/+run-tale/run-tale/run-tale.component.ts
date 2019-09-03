import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

import { WindowService } from '@framework/core/window.service';

import { InstanceService } from '@api/services/instance.service';
import { Instance } from '@api/models/instance';

import { TaleService } from '@api/services/tale.service';
import { Tale } from '@api/models/tale';

import { UserService } from '@api/services/user.service';
import { User } from '@api/models/user';

import { TaleAuthor } from '@tales/models/tale-author';

// import * as $ from 'jquery';
declare var $: any;

enum TaleExportFormat {
  ZIP = 'native',
  BagIt = 'bagit'
}

@Component({
    templateUrl: './run-tale.component.html',
    styleUrls: ['./run-tale.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class RunTaleComponent extends BaseComponent implements OnInit, OnChanges {
    taleId: string;
    tale: Tale = { title:'???', authors: [], imageId: '', dataSet: [], publishInfo: [] };
    instance: Instance;
    creator: User;
    currentTab: string = 'metadata';

    constructor(
      private ref: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router,
      private windowService: WindowService,
      private taleService: TaleService,
      private instanceService: InstanceService,
      private userService: UserService
    ) {
        super();
    }

    trackByAuthorOrcid(index: number, author: TaleAuthor) {
        return author.orcid;
    }

    taleInstanceStateChanged(event: any) {
      this.instance = event;
      this.refresh();
    }

    detectCurrentTab() {
      this.route.queryParams.subscribe(params => {
        const tab = params['tab'];
        if (tab && tab != this.currentTab) {
          this.switchTab(tab);
        }
      });
    }

    switchTab(tab: string) {
      this.currentTab = tab;
      this.router.navigate(['run', this.taleId ], {
        queryParamsHandling: "merge",
        queryParams: { 
          tab: tab
        }
      });
    }

    isTabActive(tab: string) {
      return this.currentTab === tab;
    }

    refresh() {
      if (!this.taleId) {
        // TODO: redirect to catalog view?
        console.log("No taleId given. Aborting.");
        return;
      }
      console.log(`Fetching tale with _id=${this.taleId}`);
      this.taleService.taleGetTale(this.taleId).subscribe(tale => {
        if (!tale) {
          console.error("Tale is null, something went horribly wrong:", tale);
          return;
        }

        this.tale = tale;
        this.userService.userGetUser(this.tale.creatorId).subscribe(creator => {
          console.log("Fetched tale:", this.tale);
          this.creator = creator;
          console.log("Fetched creator:", this.creator);
          this.ref.detectChanges();
        });
      }, err => {
        console.error("Failed to fetch tale:", err);
      });
    }

    detectTaleId() {
      this.route.params.subscribe(params => {
          this.taleId = params['id'];
          this.refresh();
      });
    }

    ngOnInit(): void {
      $('.ui.dropdown').dropdown();

      this.detectTaleId();
      this.detectCurrentTab();
    }

    ngOnChanges() {
      this.detectCurrentTab();
    }

    rebuildTale() {
      let params = { id: this.tale._id };
      this.taleService.taleBuildImage(params).subscribe(res => {
        console.log("Tale building:", res);
      });
    }

    restartTale() {
      if (!this.instance) {
        console.log("Cannot restart instance - instance does not exist / is not running:", this.instance);
        return;
      }

      let params = { taleId: this.tale._id };
      //this.instanceService.instanceListInstances(params).subscribe(instance => {
        this.instanceService.instanceUpdateInstance(this.instance._id).subscribe(res => {
          console.log("Tale instance updated:", res);
        });
      //});
    }

    copyTale() {
      this.taleService.taleCopyTale(this.tale._id).subscribe(res => {
        console.log("Tale copying:", res);
      });
    }

    publishTale() {
      alert("Insert publish modal here...");
    }

    viewFullScreen() {
      const e = document.documentElement;
      const methodToBeInvoked = e.requestFullscreen || e['webkitRequestFullScreen'] || e['mozRequestFullscreen'] || e['msRequestFullscreen'];
      if (methodToBeInvoked) methodToBeInvoked.call(e);
    }

    gotoDocs() {
      // TODO: how to avoid hard-coding this link?
      this.windowService.location.href = "https://wholetale.readthedocs.io/en/stable/users_guide/run.html";
    }

    exportTale(format: TaleExportFormat = TaleExportFormat.ZIP) {
      let params = { id: this.tale._id, taleFormat: format };
      this.taleService.taleExportTale(params).subscribe(res => {
        console.log(`Exporting tale=${this.tale._id} to ${format}`, res);
      });
    }
}
