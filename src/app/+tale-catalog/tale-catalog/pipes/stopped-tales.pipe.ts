import { Pipe, PipeTransform } from '@angular/core';
import { Instance, Tale } from '@api/models';

// Given a list of tales, returns only stopped tales
@Pipe({name: 'stopped'})
export class StoppedTalesPipe implements PipeTransform {
  transform(value: Array<Tale>, instances: Map<string, Instance>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => !instances[tale._id]);
  }
}
