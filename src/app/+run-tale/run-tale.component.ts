import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

@Component({
    templateUrl: './run-tale.component.html',
    styleUrls: ['./run-tale.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class RunTaleComponent extends BaseComponent {


    constructor() {
        super();
    }

}
