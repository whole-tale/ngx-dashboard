import { Component, NgZone, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Tale } from '@api/models/tale';
import { Image } from '@api/models/image';
import { ImageService } from '@api/services/image.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'create-tale-modal',
  templateUrl: './create-tale-modal.component.html',
  styleUrls: ['./create-tale-modal.component.scss']
})
export class CreateTaleModalComponent implements OnInit {
  newTale: Tale;
  datasetCitation: any;

  environments: Array<Image> = [];

  constructor(private zone: NgZone, public dialogRef: MatDialogRef<CreateTaleModalComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private imageService: ImageService) {
    this.newTale = {
      title: (data && data.params) ? data.params.name : '',
      imageId: '',
      dataSet: []
    };
  }

  ngOnInit() {
    this.parseParameters();
  }

  parseParameters() {
    // TODO: "Analyze in WT" case - Parse querystring to pre-populate dataSet/imageId/title
    this.zone.run(() => {
      $('.ui.dropdown').dropdown();
    });

    if (this.data && this.data.params && this.data.params.uri) {
      this.zone.run(() => {
        // TODO: Fetch / display data citation from datacite?
        this.datasetCitation = { doi: this.data.params.uri };
      });
    }

    // Fetch all Tale environment Images
    let listImagesParams = {};
    this.imageService.imageListImages(listImagesParams).subscribe(images => {
      this.zone.run(() => {
        this.environments = images;

        // If user specified an environment as a parameter, select it by default
        if (this.data && this.data.params && this.data.params.environment) {
          // Search for matching name
          let match = this.environments.find(env => env.name === this.data.params.environment);
          if (match) {
            // If found, select it in the dropdown
            this.newTale.imageId = match._id;
          } else {
            console.error(`Failed to find an environment named ${this.data.params.environment}`);
          }
        }
      });
    }, err => {
      console.error("Failed to list images:", err);
    });
  }

  trackById(index: number, env: Image): string {
    return env._id;
  }
}
