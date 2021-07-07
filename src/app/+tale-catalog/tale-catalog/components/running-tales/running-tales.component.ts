import { Component, Input, NgZone, Output } from '@angular/core';
import { Instance, Tale } from '@api/models';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  templateUrl: './running-tales.component.html',
  styleUrls: ['./running-tales.component.scss'],
  selector: 'app-running-tales'
})
export class RunningTalesComponent {

  @Input() taleList: Array<Tale>;

  @Input() instances: Map<string, Instance>; // = new Map<string, Instance> ();

  @Input() creators: Map<string, Instance>; // = new Map<string, Instance> ();

  constructor(private readonly zone: NgZone) {  }

  get instanceCount(): number {
    return Object.keys(this.instances).length;
  }


  showDimmer(tale: Tale): void {
    this.zone.runOutsideAngular(() => {
      $(`#${tale._id}-dimmer`).dimmer('show');
    });
  }

  hideDimmer(tale: Tale): void {
    this.zone.runOutsideAngular(() => {
      $(`#${tale._id}-dimmer`).dimmer('hide');
    });
  }

  taleInstanceStateChanged(updated: {tale: Tale, instance: Instance}): void {
    // this.refresh();
  }
}
