import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { OauthService } from '@api/services/oauth.service';
import { TaleService } from '@api/services/tale.service';
import { UserService } from '@api/services/user.service';
import { TokenService } from '@api/token.service';
import { BaseComponent, LogService } from '@shared/core';
import { ErrorModalComponent } from '@shared/error-handler/error-modal/error-modal.component';
import { Subscription } from 'rxjs';
import { routeAnimation } from '~/app/shared';

import { CreateTaleModalComponent } from './modals/create-tale-modal/create-tale-modal.component';

// import * as $ from 'jquery';
declare var $: any;

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
    currentPath = "tales";

    @Output() readonly taleCreated = new EventEmitter<Tale>();
    userSubscription: Subscription;

    constructor(
      private zone: NgZone,
      private router: Router,
      private logger: LogService,
      private taleService: TaleService,
      private userService: UserService,
      private route: ActivatedRoute,
      private ref: ChangeDetectorRef,
      private oauth: OauthService,
      public tokenService: TokenService,
      public dialog: MatDialog
    ) {
        super();
    }

    ngOnInit(): void {
      this.userSubscription =  this.tokenService.currentUser.subscribe((user: User) => {
        setTimeout(() => {
          $('#createTaleDropdown').dropdown({ action: 'hide' });
        }, 500);
      });
    }

    ngOnDestroy(): void {
      super.ngOnDestroy();
      this.userSubscription?.unsubscribe();
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
          if (!this.tokenService.getToken()) {
            // TODO: Warn user/countdown before redirecting to login?

            const redirect = encodeURIComponent(window.location.pathname + window.location.search);

            // FIXME: is it ok to use window.location.origin here?
            const params = { redirect: `${window.location.origin}/?token={girderToken}&rd=${redirect}`, list: false };
            this.oauth.oauthListProviders(params).subscribe((providers: { Globus: string, Github: string }) => {
                // TODO: How to support multiple providers here?
                window.location.href = providers.Globus;
              },
              (err) => {
                this.logger.error('Failed to GET /oauth/providers:', err);
              });
          } else {
            // Clear querystring parameters and open the Create Tale modal
            this.router.navigate(this.route.snapshot.url, { replaceUrl: true });

            this.zone.run(() => {
              const dialogRef = this.dialog.open(CreateTaleModalComponent, {
                width: '600px',
                data: { params: queryParams }
              });
              dialogRef.afterClosed().subscribe((result: {tale: Tale, asTale: boolean, url: string, baseUrl: string}) => {
                // Short-circuit for 'Cancel' case
                if (!result || !result.tale) { return; }

                const tale = result.tale;
                const asTale = result.asTale;
                const baseUrl = result.baseUrl;

                // Import Tale from Dataset
                const params = {
                  url: queryParams.uri ? decodeURIComponent(queryParams.uri) : (result.url ? result.url : ''), // Pull from querystring/form
                  imageId: tale.imageId, // Pull from user input
                  asTale: asTale ? asTale : false, // Pull from user input
                  git: !!result.url,
                  spawn: false, // if true, immediately launch a Tale instance
                  taleKwargs: tale.title ? { title: tale.title } : {},
                  lookupKwargs: baseUrl ? { base_url: baseUrl } : {},
                };
                this.taleService.taleCreateTaleFromUrl(params).subscribe((response: Tale) => {
                  this.logger.debug("Successfully submitted 'Analyze in WT' Job:", response);
                  this.taleCreated.emit(response);
                  this.router.navigate(['run', response._id]);
                }, err => {
                  this.logger.error("Failed to create Tale from Dataset:", err);
                  this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
                });
              });
            });
          }
        }
      }, 500);
    }

    openCreateTaleModal(mode: string): void {
      const config: MatDialogConfig = {
        width: '600px',
        data: { mode }
      };
      const dialogRef = this.dialog.open(CreateTaleModalComponent, config);
      dialogRef.afterClosed().subscribe((result: {tale: Tale, asTale: boolean, url?: string, baseUrl: string}) => {
        const tale = result.tale;
        const asTale = result.asTale;
        const gitOrDoiUrl = result.url;
        const baseUrl = result.baseUrl;

        if (!tale) { return; }

        // TODO: Validation

        if (mode === "git" || mode === "doi") {

          // Import Tale from Git repo
          const params = {
            url: gitOrDoiUrl ? gitOrDoiUrl: '', // Pull from querystring/form
            imageId: tale.imageId, // Pull from user input
            asTale,
            git: mode === "git",
            spawn: false, // if true, immediately launch a Tale instance
            taleKwargs: tale.title ? { title: tale.title } : {},
            lookupKwargs: baseUrl ? { base_url: baseUrl } : {},
          };

          this.taleService.taleCreateTaleFromUrl(params).subscribe((response: Tale) => {
            this.logger.debug("Importing Tale:", response);
            this.taleCreated.emit(response);
            this.router.navigate(['run', response._id]);
          }, err => {
            this.logger.error("Failed to create Tale from Git repo:", err);
            this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
          });
        } else {
          // Create classic Tale
          this.taleService.taleCreateTale(tale).subscribe((response: Tale) => {
            this.logger.debug("Successfully created Tale:", response);
            this.taleCreated.emit(response);
            this.router.navigate(['run', response._id]);
          }, err => {
            this.logger.error("Failed to create Tale:", err);
            this.dialog.open(ErrorModalComponent, { data: { error: err.error } });
          });
        }
      });
    }
}
