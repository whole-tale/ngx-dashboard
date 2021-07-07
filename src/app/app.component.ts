import { Component } from '@angular/core';
import { BaseComponent } from '@shared/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent {}
