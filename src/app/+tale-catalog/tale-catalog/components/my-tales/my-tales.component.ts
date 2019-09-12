import { Component } from '@angular/core';
import { Tale } from '@api/models/tale';

import { PublicTalesComponent } from '../public-tales/public-tales.component';

@Component({
  templateUrl: './my-tales.component.html',
  styleUrls: ['./my-tales.component.scss']
})
export class MyTalesComponent extends PublicTalesComponent {
  private myStoppedTales: Array<Tale> = [];
  private myRunningTales: Array<Tale> = [];

  get instanceCount(): number {
      return Object.keys(this.instances).length;
  }
}
