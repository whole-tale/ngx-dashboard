import { Pipe, PipeTransform } from '@angular/core';
import { Tale } from '@api/models/tale';
import { UserService } from '@api/services/user.service';
import { EMPTY, Observable } from 'rxjs';

// Given a tale, fetch and return its creator
// NOTE: This must be used with the async pipe
@Pipe({ name: 'taleCreator' })
export class TaleCreatorPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  transform(value: Tale): Observable<any> {
    if (!value || !value.creatorId) {
      return EMPTY;
    }

    return this.userService.userGetUser(value.creatorId);
  }
}
