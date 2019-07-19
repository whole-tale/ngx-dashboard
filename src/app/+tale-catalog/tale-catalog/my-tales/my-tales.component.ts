import { Component } from '@angular/core';

import { PublicTalesComponent } from '../public-tales/public-tales.component';

import { Tale } from '@api/models/tale';

@Component({
  selector: 'my-tales',
  templateUrl: './my-tales.component.html',
  styleUrls: ['./my-tales.component.scss']
})
export class MyTalesComponent extends PublicTalesComponent {
  myStoppedTales: Array<Tale> = [];
  myRunningTales: Array<Tale> = [];

  get instanceCount() {
      return Object.keys(this.instances).length;
  }

  filter(tales: Array<Tale>) {
      let myTales = tales.filter(tale => this.tokenService.user && this.tokenService.user._id && tale.creatorId === this.tokenService.user._id);

      this.zone.run(() => {
        this.myStoppedTales = tales.filter(tale => !this.instances[tale._id]);
        this.myRunningTales = tales.filter(tale => this.instances[tale._id]);
      });

      return myTales;
  }
}
