import { Component, OnInit } from '@angular/core';

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

  environments: Array<Image> = new Array<Image>();

  constructor(private imageService: ImageService) {
    this.newTale = {
      title: '',
      imageId: '',
      dataSet: []
    };

    let params = {};
    this.imageService.imageListImages(params).subscribe(images => {
      this.environments = images;
    }, err => {
      console.error("Failed to list images:", err);
    });
  }

  ngOnInit() {
    // TODO: "Analyze in WT" case - Parse querystring to pre-populate dataSet/imageId/title
    $('.ui.dropdown').dropdown();
  }

  trackById(index: number, env: Image): string {
    return env._id;
  }
}
