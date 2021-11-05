import { Pipe, PipeTransform } from '@angular/core';
import { Version } from '@api/models/version';
import { VersionService } from '@api/services/version.service';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Given a taleId, fetch and return the Tale's title
@Pipe({ name: 'versionName' })
export class TaleVersionNamePipe implements PipeTransform {
  constructor(private readonly versionService: VersionService) {}

  transform(versionId: string): Observable<string> {
    if (!versionId) {
      return EMPTY;
    }

    return this.versionService.versionGetVersion(versionId).pipe(map((v: Version) => v.name));
  }
}
