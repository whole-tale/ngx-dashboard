import { Component } from '@angular/core';

import { PublicTalesComponent } from '../public-tales/public-tales.component';

import { Tale } from '@api/models/tale';

@Component({
  selector: 'my-tales',
  templateUrl: './my-tales.component.html',
  styleUrls: ['./my-tales.component.scss']
})
export class MyTalesComponent extends PublicTalesComponent {
  private myStoppedTales: Array<Tale> = [];
  private myRunningTales: Array<Tale> = [];

  get instanceCount() {
      return Object.keys(this.instances).length;
  }
}
