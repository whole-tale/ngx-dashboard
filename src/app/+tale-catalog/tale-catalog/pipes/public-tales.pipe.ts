import { Pipe, PipeTransform } from '@angular/core';
import { Tale } from '@api/models/tale';
import { AccessLevel } from '@api/models/access-level';

// Given a list of tales, returns only public tales
@Pipe({name: 'publicTales'})
export class PublicTalesPipe implements PipeTransform {
  transform(value: Array<Tale>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => tale._accessLevel == AccessLevel.None || tale.public);
  }
}
