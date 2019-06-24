import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

@Component({
  templateUrl: './compute-environments.component.html',
  styleUrls: ['./compute-environments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeAnimation]
})
export class ComputeEnvironmentsComponent extends BaseComponent {

  constructor() {
      super();
   }

}
