import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseComponent } from './base.component';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseContainerComponent extends BaseComponent {
  // error$: Observable<string>;
  // isProcessing$: Observable<boolean>;

  constructor() {
    super();
  }
}
