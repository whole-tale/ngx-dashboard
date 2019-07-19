import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Tale } from '@api/models/tale';
import { TaleAuthor } from '@tales/models/tale-author';
import { TaleService } from '@api/services/tale.service';

import { User } from '@api/models/user';
import { UserService } from '@api/services/user.service';

import { Instance } from '@api/models/instance';
import { InstanceService } from '@api/services/instance.service';

import { TokenService } from '@api/token.service';

import { DeleteTaleModalComponent } from '../modals/delete-tale-modal/delete-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'public-tales',
  templateUrl: './public-tales.component.html',
  styleUrls: ['./public-tales.component.scss']
})
export class PublicTalesComponent implements OnInit {
  tales$: Observable<Array<Tale>>;

  instances: Map<string, Instance> = new Map<string, Instance> ();
  creators: Map<string, User> = new Map<string, User> ();

  constructor(
    protected zone: NgZone,
    private dialog: MatDialog,
    private taleService: TaleService,
    private instanceService: InstanceService,
    private userService: UserService,
    protected tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  taleInstanceStateChanged(event: any) {
    this.refresh();
  }

  showDimmer(tale: Tale) {
    this.zone.runOutsideAngular(() => {
      $('#' + tale._id + "-dimmer").dimmer('show');
    });
  }

  hideDimmer(tale: Tale) {
    this.zone.runOutsideAngular(() => {
      $('#' + tale._id + "-dimmer").dimmer('hide');
    });
  }

  trackById(index: number, tale: Tale): string {
      return tale._id;
  }

  trackByAuthorOrcid(index: number, author: TaleAuthor) {
      return author.orcid;
  }

  /** 
   * Filter down to show only public tales
   */
  filter(tales: Array<Tale>) {
    //return source.pipe(filter(tale => tale.public));
    return tales.filter(tale => tale.public);
  }

  /** 
   * Refresh tale/instance data from the server
   */
  refresh() {
    this.zone.run(() => {
      // Fetch a map of taleId => instance
      let listInstancesParams = {};
      this.instanceService.instanceListInstances(listInstancesParams).subscribe((instances: Array<Instance>) => {
        this.zone.run(() => {
          // Convert array to map of taleId -> instance
          this.instances = Object.assign({}, ...instances.map(i => ({[i.taleId]: i})));
          //this.refilter();
        });
      }, err => {
        console.error("Failed to GET /tales:", err);
      });

      // Fetch the list of public tales
      // TODO: How to filter when subscribing to an RXJS stream?
      let listTalesParams = {};
      this.tales$ = this.taleService.taleListTales(listTalesParams);
      this.tales$.subscribe((tales: Array<Tale>) => {
        this.zone.run(() => {
          // For each tale, also fetch its creator
          tales.forEach(tale => {
            this.userService.userGetUser(tale.creatorId).subscribe(creator => {
                this.creators[tale._id] = creator;
            });
          });

          // Filter tales accordingly
          //this.tales = this.filter(tales);

          //this.refilter();
        });
      }, (err: any) => {
        console.error("Failed to GET /tales:", err);
      });
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

}
