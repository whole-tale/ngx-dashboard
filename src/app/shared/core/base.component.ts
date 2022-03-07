import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: '',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnDestroy {
  protected ngUnsubscribe: BehaviorSubject<void>;

  constructor() {
    this.ngUnsubscribe = new BehaviorSubject<void>(undefined);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByIdFn(index: number): number {
    return index;
  }
}
