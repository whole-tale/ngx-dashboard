import { Component, OnChanges, Input, ChangeDetectorRef } from '@angular/core';

import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { Image } from '@api/models/image';

import { TaleAuthor } from '@tales/models/tale-author';

import { ImageService } from '@api/services/image.service';
import { TaleService } from '@api/services/tale.service';

@Component({
  selector: 'tale-metadata',
  templateUrl: './tale-metadata.component.html',
  styleUrls: ['./tale-metadata.component.scss']
})
export class TaleMetadataComponent implements OnChanges {
  @Input() tale: Tale;
  @Input() creator: User;
  environment: Image;

  // Edit mode
  _previousState: Tale;
  editing: boolean = false;

  constructor(private ref: ChangeDetectorRef, private taleService: TaleService, private imageService: ImageService) { }

  ngOnChanges() {
    if (this.tale) {
      this.imageService.imageGetImage(this.tale.imageId).subscribe(image => {
        this.environment = image;
        this.ref.detectChanges();
      }, err => {
        console.error(`Failed to pull imageId=${this.tale.imageId} for taleId=${this.tale._id}`, err);
      });
    }
  }

  // TODO: Consolidate model(s) for DataSet / dataSet?
  trackByItemId(index: number, dataset: any): string {
      return dataset.itemId;
  }

  editTale() {
    this._previousState = JSON.parse(JSON.stringify(this.tale));
    this.editing = true;
  }

  saveTaleEdit() {
    this.editing = false;
    let params = { id: this.tale._id , tale: this.tale };
    this.taleService.taleUpdateTale(params).subscribe(res => {
      console.log("Successfully saved tale state:", this.tale);
    }, err => {
      console.error("Failed updating tale:", err);
    });
  }

  cancelTaleEdit() {
    this.tale = this._previousState;
  }

  addAuthor(author: TaleAuthor) {
    this.tale.authors.push(author);
  }

  removeAuthor(author: TaleAuthor) {
    let index = this.tale.authors.indexOf(author);
    this.tale.authors.splice(index, 1);
  }
}
