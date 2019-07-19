import { ChangeDetectionStrategy, NgZone, Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';

import { CreateTaleModalComponent } from './modals/create-tale-modal/create-tale-modal.component';

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent implements AfterViewInit {
    currentPath: string = "tales";

    @Output()
    taleCreated = new EventEmitter<Tale>();

    constructor(
      private zone: NgZone,
      private taleService: TaleService,
      private route: ActivatedRoute,
      public dialog: MatDialog
    ) {
        super();
    }

    ngAfterViewInit() {

      /**
       * environment=RStudio
       * uri=https%3A%2F%2Fsearch.dataone.org%2Fview%2Fdoi%3A10.18739%2FA2VQ2S94D
       * name=Fire+influences+on+forest+recovery+and+associated+climate+feedbacks+in+Siberian+Larch+Forests%2C+Russia
       */
      setTimeout(() => {
        console.log("Detecting parameters");
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams.name || queryParams.uri || queryParams.environment) {
          this.zone.run(() => {
            const dialogRef = this.dialog.open(CreateTaleModalComponent, {
              width: '600px',
              data: { params: queryParams }
            });
            dialogRef.afterClosed().subscribe(tale => {
              // TODO: "Analyze in WT" case
              let params = {
                url: queryParams.uri ? queryParams.uri : '', // Pull from querystring
                imageId: tale.imageId, // Pull from user input
                //asTale: true, // Pull from querystring?
                spawn: true, // ??
                taleKwargs: tale.title ? `{ "title": "${tale.title}" }` : '{}', // ??
                lookupKwargs: '{}', // ??
              };
              this.taleService.taleCreateTaleFromDataset(params).subscribe(resp => {
                console.log("Successfully submitted 'Analyze in WT' Job:", resp);
              }, err => {
                console.error("Failed to create Tale from Dataset:", err);
              });
            });
          });
          
        }
      }, 1000);
    }

    openCreateTaleModal() {
      const dialogRef = this.dialog.open(CreateTaleModalComponent);
      dialogRef.afterClosed().subscribe(tale => {
        if (!tale) { return; }

        this.taleService.taleCreateTale(tale).subscribe(response => {
          console.log("Successfully created Tale:", response);
          this.taleCreated.emit(response);
          //this.refresh();
        }, err => {
          console.error("Failed to create Tale:", err);
        });
      });
    }
}
