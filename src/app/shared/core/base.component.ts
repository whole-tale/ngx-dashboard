import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnDestroy {
  protected ngUnsubscribe: Subject<void>;

  constructor() {
    this.ngUnsubscribe = new Subject<void>();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByIdFn(index: number): number {
    return index;
  }
}
