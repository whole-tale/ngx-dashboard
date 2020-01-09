import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@framework/core';
import { routeAnimation } from '~/app/shared';

@Component({
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class UserSettingsComponent extends BaseComponent {
    currentFilter = 'public';

    constructor() {
        super();
    }

}
