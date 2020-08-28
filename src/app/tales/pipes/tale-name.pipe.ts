import { Pipe, PipeTransform } from '@angular/core';
import { Tale } from '@api/models/tale';
import { TaleService } from '@api/services/tale.service';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Given a taleId, fetch and return the Tale's title
@Pipe({ name: 'taleName' })
export class TaleNamePipe implements PipeTransform {
  constructor(private readonly taleService: TaleService) {}

  transform(taleId: string): Observable<string> {
    if (!taleId) {
      return EMPTY;
    }

    return this.taleService.taleGetTale(taleId).pipe(map((t: Tale) => t.title));
  }
}
