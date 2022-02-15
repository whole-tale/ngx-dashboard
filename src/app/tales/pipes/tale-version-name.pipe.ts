import { Pipe, PipeTransform } from '@angular/core';
import { Run } from '@api/models/run';
import { Version } from '@api/models/version';

// Given a taleId, fetch and return the Tale's title
@Pipe({ name: 'versionName' })
export class TaleVersionNamePipe implements PipeTransform {
  transform(versionId: string, timeline: Array<Version | Run>): string {
    if (!versionId) {
      return '...';
    }

    // return this.versionService.versionGetVersion(versionId).pipe(map((v: Version) => v.name))
    const version = timeline.find((evt) => {
      if ('runVersionId' in evt) {
        // Skip runs, we're only looking for versions
        return false;
      }

      // This is a version.. but does its id match?
      return versionId === evt._id;
    });

    // Return the version's name, if applicable
    return version?.name || 'N / A';
  }
}
