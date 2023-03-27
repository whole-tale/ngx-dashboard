import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Image } from '@api/models/image';
import { ImageService } from '@api/services/image.service';
import { routeAnimation } from '@shared/animations';
import { BaseComponent } from '@shared/core';

declare var $: any;

@Component({
  templateUrl: './compute-environments.component.html',
  styleUrls: ['./compute-environments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeAnimation]
})
export class ComputeEnvironmentsComponent extends BaseComponent implements OnInit {
  environments: Array<Image> = [];

  constructor(private imageService: ImageService, private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    const params = { limit: 10 };
    this.imageService.imageListImages(params).subscribe((images: Array<Image>) => {
      this.environments = images;
      this.ref.detectChanges();

      setTimeout(() => {
        $('.ui.accordion').accordion();
        $('.ui.dropdown').dropdown();
      },200);
    })
  }
}
