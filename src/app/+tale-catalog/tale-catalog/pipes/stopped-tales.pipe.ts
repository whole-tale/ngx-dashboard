import { Pipe, PipeTransform } from '@angular/core';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { TokenService } from '@api/token.service';

// Given a list of tales, returns only stopped tales
@Pipe({name: 'stopped'})
export class StoppedTalesPipe implements PipeTransform {
  constructor(private tokenService: TokenService) {  }

  transform(value: Array<Tale>, instances: Map<string, Instance>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => !instances[tale._id]);
  }
}