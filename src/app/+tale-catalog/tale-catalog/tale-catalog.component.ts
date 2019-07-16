import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';
import { TaleAuthor } from '~/app/tales/models/tale-author';

import { InstanceService } from '@api/services/instance.service';
import { Instance } from '@api/models/instance';

import { UserService } from '@api/services/user.service';
import { User } from '@api/models/user';

import { TokenService } from '@api/token.service';

import { CreateTaleModalComponent } from './modals/create-tale-modal/create-tale-modal.component';
import { CopyOnLaunchModalComponent } from './modals/copy-on-launch-modal/copy-on-launch-modal.component';
import { DeleteTaleModalComponent } from './modals/delete-tale-modal/delete-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent implements OnInit, OnDestroy {
    showIntro = false;
    currentFilter = 'public';

    tales: BehaviorSubject<Array<Tale>> = new BehaviorSubject<Array<Tale>>([]);
    publicTales: Array<Tale> = new Array<Tale>();
    myStoppedTales: Array<Tale> = new Array<Tale>();
    myRunningTales: Array<Tale> = new Array<Tale>();

    instances: Map<string, Instance> = new Map<string, Instance> ();
    creators: Map<string, User> = new Map<string, User> ();
    subscription: Subscription;

    get instanceCount() {
        return Object.keys(this.instances).length;
    }

    constructor(
      private ref: ChangeDetectorRef,
      private taleService: TaleService,
      private instanceService: InstanceService,
      private userService: UserService,
      private tokenService: TokenService,
      public dialog: MatDialog
    ) {
        super();
    }

    ngOnInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    showDimmer(tale: Tale) {
      $('#' + tale._id + "-dimmer").dimmer('show');
    }

    hideDimmer(tale: Tale) {
      $('#' + tale._id + "-dimmer").dimmer('hide');
    }

    trackById(index: number, tale: Tale): string {
        return tale._id;
    }

    trackByAuthorOrcid(index: number, author: TaleAuthor) {
        return author.orcid;
    }

    startTale(tale: Tale) {
      /* MOCK DATA:
      
      this.instances[tale._id] = { status: 0 };
      console.log("Starting tale:", tale._id);
      let interval = setInterval(() => {
        this.instances[tale._id] = { status: 1 };
        console.log("Tale started:", tale._id);
        this.ref.detectChanges();
      }, 3000);*/

      if (tale._accessLevel < 2) {
        this.openCopyOnLaunchModal(tale);
        return;
      }

      let params: InstanceService.InstanceCreateInstanceParams = { taleId: tale._id };
      this.instanceService.instanceCreateInstance(params).subscribe((instance: Instance) => {
        console.log("Starting tale:", tale._id);
        this.instances[tale._id] = instance;
        this.refilter();
        this.ref.detectChanges();

        // Poll / wait for launch
        // TODO: Fix edge cases (refresh, etc)
        let interval = setInterval(() => {
          this.instanceService.instanceGetInstance(instance._id).subscribe((watched: Instance) => {
          console.log("Polling for instance state:", watched._id);
          this.instances[tale._id] = watched;
          this.refilter();
          this.ref.detectChanges();
          
          // Once instance is running, stop the polling
          if (watched.status === 1) {
            clearInterval(interval);
            interval = null;
          }
          });
        }, 2000);
      }, (err: any) => {
        console.error("Failed to create instance:", err);
      });
    }

    stopTale(tale: Tale) {
      /* MOCK DATA:
      
      this.instances[tale._id] = { status: 2 };
      console.log("Stopping tale:", tale._id);
      setTimeout(() => {
        this.instances[tale._id] = null;
        console.log("Tale stopped:", tale._id);
        this.ref.detectChanges();
      }, 3000);*/

      let instance = this.instances[tale._id];
      if (!instance) {
          console.log("No instance found for taleId=", tale._id);
          return;
      }

      this.instanceService.instanceDeleteInstance(instance._id).subscribe((instance: Instance) => {
        console.log("Stopping tale:", tale._id);
        this.instances[tale._id] = null;
        this.refilter();
        this.ref.detectChanges();
      }, (err: any) => {
        console.error("Failed to delete instance:", err);
      });
    }

    openCopyOnLaunchModal(tale: Tale) {
      const dialogRef = this.dialog.open(CopyOnLaunchModalComponent);
      dialogRef.afterClosed().subscribe(res => {
          if (!res) { return; }

          this.taleService.taleCopyTale(tale._id).subscribe(taleCopy => {
              console.log("Successfully copied Tale... now launching!", taleCopy);
              this.startTale(taleCopy);
              this.refresh();
          }, err => {
              console.error("Failed to copy Tale:", err)
          });
      });
    }

    openCreateTaleModal() {
      const dialogRef = this.dialog.open(CreateTaleModalComponent);
      dialogRef.afterClosed().subscribe(tale => {
        if (!tale) { return; }

        if (tale.dataSet.length) {

          // TODO: "Analyze in WT" case
          let params = {
            url: '', // Pull from querystring?
            imageId: '', // Pull from querystring?
            asTale: true, // Pull from querystring?
            spawn: true, // ??
            taleKwargs: '', // ??
            lookupKwargs: '', // ??
          };
          this.taleService.taleCreateTaleFromDataset(params).subscribe();
        } else {
          this.taleService.taleCreateTale(tale).subscribe(response => {
            console.log("Successfully created Tale:", response);
            this.refresh();
          }, err => {
            console.error("Failed to create Tale:", err);
          });
        }
      });
    }

    openDeleteTaleModal(tale: Tale) {
      const dialogRef = this.dialog.open(DeleteTaleModalComponent);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) { return; }
        
        let id = tale._id;
        this.taleService.taleDeleteTale({ id }).subscribe(res => {
            console.log("Successfully deleted Tale:", res);
          this.refresh();
        }, err => {
            console.error("Failed to delete Tale:", err);
        });
      });
    }

    changeFilter(newFilter: string) {
      this.currentFilter = newFilter;
      this.refresh();
    }

    refresh() {
        let listInstancesParams = {};
        this.instanceService.instanceListInstances(listInstancesParams).subscribe((instances: Array<Instance>) => {
          // Convert array to map of taleId -> instance
          this.instances = Object.assign({}, ...instances.map(i => ({[i.taleId]: i})));
          this.refilter();
          this.ref.detectChanges();
        }, err => {
          console.error("Failed to GET /tales:", err);
        });


        let listTalesParams = {};
        this.taleService.taleListTales(listTalesParams).subscribe((tales: Array<Tale>) => {
            // For each tale, fetch it's creator
            tales.forEach(tale => {
              this.userService.userGetUser(tale.creatorId).subscribe(creator => {
                  this.creators[tale._id] = creator;
                  this.ref.detectChanges();
              });
            });

            this.tales.next(tales);
            this.refilter();
            this.ref.detectChanges();
        }, err => {
          console.error("Failed to GET /tales:", err);
        });
    }

    refilter() {
        this.publicTales = this.tales.value.filter(tale => tale.public);
        this.myStoppedTales = this.tales.value.filter(tale => this.tokenService.user._id && tale.creatorId === this.tokenService.user._id && !this.instances[tale._id]);
        this.myRunningTales = this.tales.value.filter(tale => this.tokenService.user._id && tale.creatorId === this.tokenService.user._id && this.instances[tale._id]);
    }
}
