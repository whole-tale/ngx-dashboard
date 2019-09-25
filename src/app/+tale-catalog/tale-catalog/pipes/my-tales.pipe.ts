import { Pipe, PipeTransform } from '@angular/core';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { TokenService } from '@api/token.service';

// Given a list of tales, returns only tales that were created by the current user
@Pipe({name: 'myTales'})
export class MyTalesPipe implements PipeTransform {
  constructor(private tokenService: TokenService) {  }

  transform(value: Array<Tale>, user: User): Array<Tale> {
    if (!value || !value.length || !user._id) {
      return [];
    }

    return value.filter(tale => user && user._id && tale.creatorId === user._id);
  }
}