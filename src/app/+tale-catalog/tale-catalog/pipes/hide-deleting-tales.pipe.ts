import { Pipe, PipeTransform } from '@angular/core';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';

// Given a list of tales, returns only stopped tales
@Pipe({name: 'hideDeleting'})
export class HideDeletingTalesPipe implements PipeTransform {
  constructor() {  }

  transform(value: Array<Tale>, instances: Map<string, Instance>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => {
      const instance = instances[tale._id];
      return instance && instance.status !== 3;
    });
  }
}
