import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

@Component({
    templateUrl: './tale-catalog.component.html',
    styleUrls: ['tale-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class TaleCatalogComponent extends BaseComponent {
    showIntro = false;
    currentFilter = 'public';
    tales: Array<any> = [];

    constructor() {
        super();
    }
}
