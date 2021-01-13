import { Pipe, PipeTransform } from '@angular/core';
import { AccessLevel } from '@api/models/access-level';
import { Tale } from '@api/models/tale';

// Given a list of tales, returns only stopped tales
@Pipe({name: 'sharedTales'})
export class SharedTalesPipe implements PipeTransform {

  transform(value: Array<Tale>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => (tale._accessLevel === AccessLevel.Read || tale._accessLevel === AccessLevel.Write));
  }
}
