import { Pipe, PipeTransform } from '@angular/core';
import { Instance } from '@api/models/instance';
import { Tale } from '@api/models/tale';
import { TokenService } from '@api/token.service';

// Given a list of tales, returns only tales that were created by the current user
@Pipe({name: 'mine'})
export class MyTalesPipe implements PipeTransform {
  constructor(private tokenService: TokenService) {  }

  transform(value: Array<Tale>): Array<Tale> {
    if (!value) {
      return [];
    }

    return value.filter(tale => this.tokenService.user && this.tokenService.user._id && tale.creatorId === this.tokenService.user._id);
  }
}