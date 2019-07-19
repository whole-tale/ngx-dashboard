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

import { DeleteTaleModalComponent } from '../../modals/delete-tale-modal/delete-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'public-tales',
  templateUrl: './public-tales.component.html',
  styleUrls: ['./public-tales.component.scss']
})
export class PublicTalesComponent implements OnInit {
  tales$: Observable<Array<Tale>>;
  tales: Array<Tale> = [];
  private publicTales: Array<Tale> = [];

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
   * Refresh tale/instance data from the server
   */
  refresh() {
    // Fetch a map of taleId => instance
    let listInstancesParams = {};
    this.instanceService.instanceListInstances(listInstancesParams).subscribe((instances: Array<Instance>) => {
      this.zone.run(() => {
        // Convert array to map of taleId -> instance
        this.instances = Object.assign({}, ...instances.map(i => ({[i.taleId]: i})));
        //this.refilter();
      });
    }, err => {
      console.error("Failed to GET /instance:", err);
    });

    // Fetch the list of public tales
    let listTalesParams = {};
    this.tales$ = this.taleService.taleListTales(listTalesParams)
    this.tales$.subscribe((tales: Array<Tale>) => {
      this.zone.run(() => {
        this.tales = tales;
        //this.refilter();
      });

      // For each tale, also fetch its creator
      this.tales.forEach(tale => {
        this.userService.userGetUser(tale.creatorId).subscribe(creator => {
          this.zone.run(() => {
            this.creators[tale._id] = creator;
          });
        }, err => {
          console.error("Failed to GET /user/" + tale.creatorId + ":", err);
        });
      });
    }, (err: any) => {
      console.error("Failed to GET /tale:", err);
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
