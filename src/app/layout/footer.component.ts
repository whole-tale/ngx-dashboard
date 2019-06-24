import { Component } from '@angular/core';
import { BaseComponent } from '~/app/framework/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent extends BaseComponent {
  commit = '{commit}';

  constructor() {
    super();
  }
}
