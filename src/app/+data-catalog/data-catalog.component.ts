import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

@Component({
    templateUrl: './data-catalog.component.html',
    styleUrls: ['./data-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class DataCatalogComponent extends BaseComponent {
    currentFilter = 'public';

    constructor() {
        super();
    }

}
