import { Pipe, PipeTransform } from '@angular/core';
import { Tale } from '@api/models/tale';
import { ImageService } from '@api/services/image.service';
import { EMPTY, Observable } from 'rxjs';

// Given a tale, fetch and return its image
// NOTE: This must be used with the async pipe
@Pipe({ name: 'taleImage' })
export class TaleImagePipe implements PipeTransform {
  constructor(private readonly imageService: ImageService) {}

  transform(value: Tale): Observable<any> {
    if (!value || !value.imageId) {
      return EMPTY;
    }

    return this.imageService.imageGetImage(value.imageId);
  }
}
