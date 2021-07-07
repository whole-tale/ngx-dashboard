import { NgZone } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';

export const enterZone = (zone: NgZone): OperatorFunction<null, any> => <T>(source: Observable<T>) =>
  new Observable<T>(observer =>
    source.subscribe({
      next: x => zone.run(() => observer.next(x)),
      error: err => observer.error(err),
      complete: () => observer.complete()
    })
  );
