import { Pipe, PipeTransform } from '@angular/core';
import { Tale } from '@api/models/tale';
import { AccessLevel } from '@api/models/access-level';

// Given a list of tales, returns only stopped tales
@Pipe({name: 'sharedTales'})
export class SharedTalesPipe implements PipeTransform {
  constructor() {  }

  transform(value: Array<Tale>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => {
      return tale._accessLevel == AccessLevel.Read || tale._accessLevel == AccessLevel.Write;
    });
  }
}
