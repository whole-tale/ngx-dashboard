import { Component } from '@angular/core';

import { PublicTalesComponent } from '../public-tales/public-tales.component';

@Component({
  templateUrl: './shared-tales.component.html',
  styleUrls: ['./shared-tales.component.scss'],
  selector: 'app-shared-tales'
})
export class SharedTalesComponent extends PublicTalesComponent {

}
