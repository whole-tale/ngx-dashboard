import { Pipe, PipeTransform } from '@angular/core';
import { AccessLevel, Tale } from '@api/models';

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
