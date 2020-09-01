import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { InstanceService } from '@api/services/instance.service';
import { TaleService } from '@api/services/tale.service';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { LogService } from '@framework/core/log.service';
import { TaleAuthor } from '@tales/models/tale-author';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DeleteTaleModalComponent } from '../../modals/delete-tale-modal/delete-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './public-tales.component.html',
  styleUrls: ['./public-tales.component.scss'],
  selector: 'app-public-tales'
})
export class PublicTalesComponent implements OnChanges, OnInit {
  tales$: Observable<Array<Tale>> = new Observable<Array<Tale>>();
  tales: Array<Tale> = [];
  publicTales: Array<Tale> = [];

  protected truncateLength = 100;

  searchQuery = '';

  user: User;

  get instanceCount(): number {
    return Object.keys(this.instances).length;
  }

  instances: Map<string, Instance> = new Map<string, Instance> ();
  creators: Map<string, User> = new Map<string, User> ();

  constructor(
    protected zone: NgZone,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private logger: LogService,
    private taleService: TaleService,
    private instanceService: InstanceService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const listTalesParams = {};
    this.tales$ = this.taleService.taleListTales(listTalesParams);
    this.userService.userGetMe().subscribe(user => {
      this.user = user;
    });
    this.refresh();
  }

  ngOnChanges(): void {
    this.refresh();
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
    // Fetch a map of taleId => instance
    const listInstancesParams = {};
    this.instanceService.instanceListInstances(listInstancesParams).subscribe((instances: Array<Instance>) => {
      this.zone.run(() => {
        // Convert array to map of taleId -> instance
        // Filter deleting instances
        this.instances = Object.assign({}, ...instances.filter(i => i.status !== 3).map(i => ({[i.taleId]: i})));
      });
    }, (err: any) => {
      this.logger.error("Failed to GET /instance:", err);
    });

    // Fetch the list of public tales
    const listTalesParams = {};
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

        // Explicitly force Tale list binding to refresh
        this.tales$ = this.taleService.taleListTales({});
        this.refresh();
      }, err => {
          this.logger.error("Failed to delete Tale:", err);
      });
    });
  }

}
