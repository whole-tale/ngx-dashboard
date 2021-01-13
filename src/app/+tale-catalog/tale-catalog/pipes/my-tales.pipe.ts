import { Pipe, PipeTransform } from '@angular/core';
import { AccessLevel } from '@api/models/access-level';
import { Tale } from '@api/models/tale';

// Given a list of tales, returns only tales that were created by the current user
@Pipe({name: 'myTales'})
export class MyTalesPipe implements PipeTransform {

  transform(value: Array<Tale>): Array<Tale> {
    if (!value || !value.length) {
      return [];
    }

    return value.filter(tale => tale._accessLevel === AccessLevel.Admin);
  }
}
