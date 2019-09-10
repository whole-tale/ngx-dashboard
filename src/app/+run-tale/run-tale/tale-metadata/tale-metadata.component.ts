import { Component, OnChanges, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { enterZone } from '@framework/ngrx/enter-zone.operator';

import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { Image } from '@api/models/image';

import { TaleAuthor } from '@tales/models/tale-author';

import { ImageService } from '@api/services/image.service';
import { TaleService } from '@api/services/tale.service';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'tale-metadata',
  templateUrl: './tale-metadata.component.html',
  styleUrls: ['./tale-metadata.component.scss']
})
export class TaleMetadataComponent implements OnChanges, OnInit {
  @Input() tale: Tale;
  @Input() creator: User;

  environments: Observable<Array<Image>>;
  environment: Image;
  newAuthor: TaleAuthor;

  // Edit mode
  _previousState: Tale;
  editing = false;

  constructor(private ref: ChangeDetectorRef,
              private zone: NgZone,
              private taleService: TaleService,
              private imageService: ImageService) {
    this.resetNewAuthor();
  }

  ngOnInit() {
    const params = {};
    this.environments = this.imageService.imageListImages(params);
    $('.ui.dropdown').dropdown();
  }

  ngOnChanges() {
    if (this.tale) {
      this.imageService.imageGetImage(this.tale.imageId).subscribe(env => {
        this.zone.run(() => { this.environment = env; });
      });
    }
  }

  // TODO: Consolidate model(s) for DataSet / dataSet?
  trackByItemId(index: number, dataset: any): string {
      return dataset.itemId;
  }

  copy(json: any) {
    return JSON.parse(JSON.stringify(json));
  }

  editTale() {
    this._previousState = this.copy(this.tale);
    this.editing = true;
  }

  saveTaleEdit() {
    const params = { id: this.tale._id , tale: this.tale };
    this.taleService.taleUpdateTale(params)
                    .subscribe(res => {
      console.log("Successfully saved tale state:", this.tale);
      this.zone.run(() => {
        this.editing = false;
      });
    }, err => {
      console.error("Failed updating tale:", err);
    });
  }

  cancelTaleEdit() {
    this.tale = this.copy(this._previousState);
    this.editing = false;
  }

  addAuthor(author: TaleAuthor) {
    this.tale.authors.push(author);
    this.resetNewAuthor();
  }

  removeAuthor(author: TaleAuthor) {
    const index = this.tale.authors.indexOf(author);
    this.tale.authors.splice(index, 1);
  }

  resetNewAuthor() {
    this.newAuthor = {
      firstName: '',
      lastName: '',
      orcid: ''
    };
  }
}
