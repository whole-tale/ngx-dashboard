import { AfterViewInit, Component, EventEmitter, NgZone, Output} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';
import { BaseComponent } from '@framework/core';
import { LogService } from '@framework/core/log.service';
import { routeAnimation } from '~/app/shared';

import { CreateTaleModalComponent } from './modals/create-tale-modal/create-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent implements AfterViewInit {
    currentPath = "tales";

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
      $('#createTaleDropdown').dropdown({ action: 'hide' });

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
            dialogRef.afterClosed().subscribe((result: {tale: Tale, asTale: boolean, url: string, baseUrl: string}) => {
              const tale = result.tale;
              const asTale = result.asTale;
              const baseUrl = result.baseUrl;

              // Short-circuit for 'Cancel' case
              if (!tale) { return; }

              // Import Tale from Dataset
              const params = {
                url: queryParams.uri ? queryParams.uri : (result.url ? result.url : ''), // Pull from querystring/form
                imageId: tale.imageId, // Pull from user input
                asTale: asTale ? asTale : false, // Pull from user input
                git: result.url ? true : false,
                spawn: false, // if true, immediately launch a Tale instance
                taleKwargs: tale.title ? { title: tale.title } : {}, 
                lookupKwargs: baseUrl ? { base_url: baseUrl } : {},
              };
              this.taleService.taleCreateTaleFromUrl(params).subscribe((response: Tale) => {
                this.logger.debug("Successfully submitted 'Analyze in WT' Job:", response);
                this.taleCreated.emit(response);
                this.router.navigate(['run', response._id]);
              }, err => {
                this.logger.error("Failed to create Tale from Dataset:", err);
              });
            });
          });

        }
      }, 1000);
    }

    openCreateTaleModal(showGit = false): void {
      const config: MatDialogConfig = {
        data: { showGit }
      };
      const dialogRef = this.dialog.open(CreateTaleModalComponent, config);
      dialogRef.afterClosed().subscribe((result: {tale: Tale, asTale: boolean, url?: string, baseUrl: string}) => {
        const tale = result.tale;
        const gitUrl = result.url;
        const baseUrl = result.baseUrl;

        if (!tale) { return; }

        // TODO: Validation

        if (showGit) {
          // Import Tale from Git repo
          const params = {
            url: gitUrl ? gitUrl: '', // Pull from querystring/form
            imageId: tale.imageId, // Pull from user input
            asTale: false, // Pull from user input
            git: gitUrl ? true : false,
            spawn: false, // if true, immediately launch a Tale instance
            taleKwargs: tale.title ? { title: tale.title } : {},
            lookupKwargs: baseUrl ? { base_url: baseUrl } : {},
          };

          this.taleService.taleCreateTaleFromUrl(params).subscribe((response: Tale) => {
            this.logger.debug("Importing Tale from Git:", response);
            this.taleCreated.emit(response);
            this.router.navigate(['run', response._id]);
          }, err => {
            this.logger.error("Failed to create Tale from Git repo:", err);
          });
        } else {
          // Create classic Tale
          this.taleService.taleCreateTale(tale).subscribe((response: Tale) => {
            this.logger.debug("Successfully created Tale:", response);
            this.taleCreated.emit(response);
            this.router.navigate(['run', response._id]);
          }, err => {
            this.logger.error("Failed to create Tale:", err);
          });
        }
      });
    }
}
