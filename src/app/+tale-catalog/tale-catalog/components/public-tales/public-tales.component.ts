import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel, Instance, Tale, User } from '@api/models';
import { InstanceService, TaleService, UserService } from '@api/services';
import { TokenService } from '@api/token.service';
import { LogService } from '@shared/core/log.service';
import { TaleAuthor } from '@tales/models/tale-author';
import { SyncService } from '@tales/sync.service';
import { Subscription } from 'rxjs';

import { DeleteTaleModalComponent } from '../../modals/delete-tale-modal/delete-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './public-tales.component.html',
  styleUrls: ['./public-tales.component.scss'],
  selector: 'app-public-tales'
})
export class PublicTalesComponent implements OnChanges, OnInit, OnDestroy {
  tales: Array<Tale> = [];
  publicTales: Array<Tale> = [];

  taleCreatedSubscription: Subscription;
  taleUpdatedSubscription: Subscription;
  taleRemovedSubscription: Subscription;

  taleImportStartedSubscription: Subscription;
  taleImportCompletedSubscription: Subscription;
  taleImportFailedSubscription: Subscription;

  taleSharedSubscription: Subscription;
  taleUnsharedSubscription: Subscription;

  instanceLaunchingSubscription: Subscription;
  instanceRunningSubscription: Subscription;
  instanceDeletedSubscription: Subscription;
  instanceErrorSubscription: Subscription;

  AccessLevel: any = AccessLevel;

  truncateLength = 100;

  searchQuery = '';

  instances: Map<string, Instance> = new Map<string, Instance> ();
  creators: Map<string, User> = new Map<string, User> ();

  get instanceCount(): number {
    return Object.keys(this.instances).length;
  }

  constructor(
    protected zone: NgZone,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private logger: LogService,
    private taleService: TaleService,
    private instanceService: InstanceService,
    public tokenService: TokenService,
    private userService: UserService,
    private syncService: SyncService
  ) {  }

  ngOnInit(): void {
    this.refresh();
    this.taleCreatedSubscription = this.syncService.taleCreatedSubject.subscribe((taleId: string) => {
      this.refresh();
    });
    this.taleRemovedSubscription = this.syncService.taleRemovedSubject.subscribe((taleId: string) => {
      this.refresh();
    });
    this.taleUpdatedSubscription = this.syncService.taleUpdatedSubject.subscribe((taleId: string) => {
      this.refresh();
    });

    this.taleSharedSubscription = this.syncService.taleSharedSubject.subscribe((taleId: string) => {
      this.refresh();
    });
    this.taleUnsharedSubscription = this.syncService.taleUnsharedSubject.subscribe((taleId: string) => {
      this.refresh();
    });

    this.taleImportStartedSubscription = this.syncService.taleImportFailedSubject.subscribe((taleId: string) => {
      this.refresh();
    });
    this.taleImportCompletedSubscription = this.syncService.taleImportCompletedSubject.subscribe((taleId: string) => {
      this.refresh();
    });
    this.taleImportFailedSubscription = this.syncService.taleImportFailedSubject.subscribe((taleId: string) => {
      this.refresh();
    });

    this.instanceLaunchingSubscription = this.syncService.instanceLaunchingSubject.subscribe((resource: { taleId: string, instanceId: string }) => {
      this.refresh();
    });
    this.instanceRunningSubscription = this.syncService.instanceRunningSubject.subscribe((resource: { taleId: string, instanceId: string }) => {
      this.refresh();
    });
    // TODO: Support InstanceDeleting?
    this.instanceDeletedSubscription = this.syncService.instanceDeletedSubject.subscribe((resource: { taleId: string, instanceId: string }) => {
      this.refresh();
    });
    this.instanceErrorSubscription = this.syncService.instanceErrorSubject.subscribe((resource: { taleId: string, instanceId: string }) => {
      this.refresh();
    });
  }

  ngOnChanges(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.taleCreatedSubscription.unsubscribe();
    this.taleUpdatedSubscription.unsubscribe();
    this.taleRemovedSubscription.unsubscribe();

    this.taleSharedSubscription.unsubscribe();
    this.taleUnsharedSubscription.unsubscribe();

    this.taleImportCompletedSubscription.unsubscribe();
    this.taleImportStartedSubscription.unsubscribe();
    this.taleImportFailedSubscription.unsubscribe();

    this.instanceLaunchingSubscription.unsubscribe();
    this.instanceRunningSubscription.unsubscribe();
    this.instanceDeletedSubscription.unsubscribe();
    this.instanceErrorSubscription.unsubscribe();
  }

  taleInstanceStateChanged(updated: {tale: Tale, instance: Instance}): void {
    this.refresh();
  }

  showDimmer(tale: Tale): void {
    this.zone.runOutsideAngular(() => {
      $(`#${tale._id}-dimmer`).dimmer('show');
    });
  }

  hideDimmer(tale: Tale): void {
    this.zone.runOutsideAngular(() => {
      $(`#${tale._id}-dimmer`).dimmer('hide');
    });
  }

  trackById(index: number, tale: Tale): string {
    return tale._id;
  }

  trackByAuthorOrcid(index: number, author: TaleAuthor): string {
    return author.orcid;
  }

  // Refresh tale/instance data from the server
  refresh(): void {
    this.ref.detectChanges();

    if (this.tokenService.user.value) {
      // Fetch a map of taleId => instance
      const listInstancesParams = {};
      this.instanceService.instanceListInstances(listInstancesParams).subscribe((instances: Array<Instance>) => {
        this.zone.run(() => {
          // Convert array to map of taleId -> instance
          // Filter deleting instances
          this.instances = Object.assign({}, ...instances.filter(i => i.status !== 3).map(i => ({ [i.taleId]: i })));
        });
        this.ref.detectChanges();
      }, (err: any) => {
        this.logger.error("Failed to GET /instance:", err);
      });
    }

    // Fetch the list of public tales
    const listTalesParams = { limit: 0 };
    this.taleService.taleListTales(listTalesParams).subscribe((tales: Array<Tale>) => {
      // Filter based on search query
      this.tales = tales;
      this.ref.detectChanges();

      // For each tale, also fetch its creator
      this.tales.forEach(tale => {
        this.userService.userGetUser(tale.creatorId).subscribe((creator: User) => {
          this.creators[tale._id] = creator;
          this.ref.detectChanges();
        }, (err: any) => {
          this.logger.error(`Failed to GET /user/${tale.creatorId}:`, err);
        });
      });
    }, (err: any) => {
      this.logger.error("Failed to GET /tale:", err);
    });
  }

  openDeleteTaleModal(tale: Tale): void {
    const dialogRef = this.dialog.open(DeleteTaleModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return; }

      const id = tale._id;
      this.taleService.taleDeleteTale({ id }).subscribe(response => {
        this.logger.debug("Successfully deleted Tale:", response);

        this.tales = this.tales.filter((t: Tale) => t._id !== id);
        this.ref.detectChanges();
      }, err => {
          this.logger.error("Failed to delete Tale:", err);
      });
    });
  }

}
