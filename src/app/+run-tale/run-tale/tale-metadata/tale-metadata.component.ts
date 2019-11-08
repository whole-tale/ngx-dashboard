import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { Image } from '@api/models/image';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { ImageService } from '@api/services/image.service';
import { TaleService } from '@api/services/tale.service';
import { LogService } from '@framework/core/log.service';
import { enterZone } from '@framework/ngrx/enter-zone.operator';
import { TaleAuthor } from '@tales/models/tale-author';
import { Observable } from 'rxjs';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-tale-metadata',
  templateUrl: './tale-metadata.component.html',
  styleUrls: ['./tale-metadata.component.scss']
})
export class TaleMetadataComponent implements OnInit {
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
              private logger: LogService,
              private taleService: TaleService,
              private imageService: ImageService) {
    this.resetNewAuthor();
  }

  ngOnInit(): void {
    const params = {};
    this.environments = this.imageService.imageListImages(params);
    $('.ui.dropdown').dropdown();
  }

  trackById(index: number, model: any): string {
      return model._id || model.orcid || model.itemId;
  }

  copy(json: any): any {
    return JSON.parse(JSON.stringify(json));
  }

  editTale(): void {
    this._previousState = this.copy(this.tale);
    this.editing = true;
  }

  saveTaleEdit(): void {
    const params = { id: this.tale._id , tale: this.tale };
    this.taleService.taleUpdateTale(params)
                   .subscribe(res => {
      this.logger.debug("Successfully saved tale state:", this.tale);
      this.zone.run(() => {
        this.editing = false;
      });
    }, err => {
      this.logger.error("Failed updating tale:", err);
    });
  }

  cancelTaleEdit(): void {
    this.tale = this.copy(this._previousState);
    this.editing = false;
  }

  addAuthor(author: TaleAuthor): void {
    this.tale.authors.push(author);
    this.resetNewAuthor();
  }

  removeAuthor(author: TaleAuthor): void {
    const index = this.tale.authors.indexOf(author);
    this.tale.authors.splice(index, 1);
  }

  resetNewAuthor(): void {
    this.newAuthor = {
      firstName: '',
      lastName: '',
      orcid: ''
    };
  }
}
