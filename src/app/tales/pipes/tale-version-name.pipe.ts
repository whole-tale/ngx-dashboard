import { Pipe, PipeTransform } from '@angular/core';
import { Run } from '@api/models/run';
import { Version } from '@api/models/version';
import { VersionService } from '@api/services/version.service';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Given a taleId, fetch and return the Tale's title
@Pipe({ name: 'versionName' })
export class TaleVersionNamePipe implements PipeTransform {
  constructor(private readonly versionService: VersionService) {}

  transform(versionId: string, timeline: Array<Version | Run>): string {
    if (!versionId) {
      return '...';
    }

    // return this.versionService.versionGetVersion(versionId).pipe(map((v: Version) => v.name))
    const version = timeline.find((evt) => {
      // Skip runs, only looking for versions
      if ('runVersionId' in evt) {
        return false;
      }

      return versionId === evt._id;
    });

    return version?.name || 'N / A';
  }
}
