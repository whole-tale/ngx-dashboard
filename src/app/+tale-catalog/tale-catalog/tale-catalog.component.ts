import { AfterViewInit, Component, EventEmitter, NgZone, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { routeAnimation } from '~/app/shared';

import { CreateTaleModalComponent } from './modals/create-tale-modal/create-tale-modal.component';

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent implements AfterViewInit {
    currentPath = "tales";
    searchQuery = '';

    @Output() readonly taleCreated = new EventEmitter<Tale>();

    constructor(
      private zone: NgZone,
      private router: Router,
      private logger: LogService,
      private taleService: TaleService,
      private route: ActivatedRoute,
      public dialog: MatDialog
    ) {
        super();
    }

    ngAfterViewInit(): void {

      // Sample parameters:
      //    environment=RStudio
      //    uri=https%3A%2F%2Fsearch.dataone.org%2Fview%2Fdoi%3A10.18739%2FA2VQ2S94D
      //    name=Fire+influences+on+forest+recovery+and+associated+climate+feedbacks+in+Siberian+Larch+Forests%2C+Russia
      //    asTale=true
      setTimeout(() => {
        this.logger.debug("Detecting parameters");
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams.name || queryParams.uri || queryParams.environment) {
          // Clear querystring parameters and open the Create Tale modal
          this.router.navigateByUrl('/', { replaceUrl: true });

          this.zone.run(() => {
            const dialogRef = this.dialog.open(CreateTaleModalComponent, {
              width: '600px',
              data: { params: queryParams }
            });
            dialogRef.afterClosed().subscribe(tale => {
              // TODO: "Analyze in WT" case
              const params = {
                url: queryParams.uri ? queryParams.uri : '', // Pull from querystring
                imageId: tale.imageId, // Pull from user input
                asTale: queryParams.asTale, // TODO: Pull from querystring
                spawn: true, // ??
                taleKwargs: tale.title ? `{ "title": "${tale.title}" }` : '{}', // ??
                lookupKwargs: '{}', // ??
              };
              this.taleService.taleCreateTaleFromDataset(params).subscribe(resp => {
                this.logger.debug("Successfully submitted 'Analyze in WT' Job:", resp);
              }, err => {
                this.logger.error("Failed to create Tale from Dataset:", err);
              });
            });
          });
          
        }
      }, 1000);
    }

    openCreateTaleModal(): void {
      const dialogRef = this.dialog.open(CreateTaleModalComponent);
      dialogRef.afterClosed().subscribe(tale => {
        if (!tale) { return; }

        // TODO: Validation

        this.taleService.taleCreateTale(tale).subscribe((response: Tale) => {
          this.logger.debug("Successfully created Tale:", response);
          this.taleCreated.emit(response);
          this.router.navigate(['run', response._id])
        }, err => {
          this.logger.error("Failed to create Tale:", err);
        });
      });
    }
}
