import { Pipe, PipeTransform } from '@angular/core';

import { Tale } from '@api/models/tale';
import { Instance } from '@api/models/instance';

import { TokenService } from '@api/token.service';

/*
 * Given a list of tales, returns only running tales.
*/
@Pipe({name: 'running'})
export class RunningTalesPipe implements PipeTransform {
  constructor(private tokenService: TokenService) {  }

  transform(value: Array<Tale>, instances: Map<string, Instance>): Array<Tale> {
    if (!value) { return []; }
    return value.filter(tale => instances[tale._id]);
  }
}