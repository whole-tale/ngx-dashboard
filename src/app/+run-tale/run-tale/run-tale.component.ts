import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

import { TaleService } from '@api/services/tale.service';
import { Tale } from '@api/models/tale';

import { UserService } from '@api/services/user.service';
import { User } from '@api/models/user';

import { TaleAuthor } from '@tales/models/tale-author';

// import * as $ from 'jquery';
declare var $: any;

@Component({
    templateUrl: './run-tale.component.html',
    styleUrls: ['./run-tale.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class RunTaleComponent extends BaseComponent implements OnInit {
    taleId: string;
    tale: Tale = { title:'???', authors: [], imageId: '', dataSet: [], publishInfo: [] };
    creator: User;
    currentTab: string = 'metadata';

    constructor(
      private ref: ChangeDetectorRef,
      private route: ActivatedRoute,
      private taleService: TaleService,
      private userService: UserService
    ) {
        super();
    }

    trackByAuthorOrcid(index: number, author: TaleAuthor) {
        return author.orcid;
    }

    ngOnInit(): void {
      $('.ui.dropdown').dropdown();

      this.route.queryParams.subscribe(params => {
        const tab = params['tab'];
        if (tab) {
          this.currentTab = tab;
          this.ref.detectChanges();
        }
      });

      this.route.params.subscribe(params => {
          this.taleId = params['id'];
          if (!this.taleId) {
            // TODO: redirect to catalog view
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
      });
    }
}
