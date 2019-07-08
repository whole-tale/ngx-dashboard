import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '~/app/framework/core';
import { routeAnimation } from '~/app/shared';

@Component({
    templateUrl: './run-tale.component.html',
    styleUrls: ['./run-tale.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimation]
})
export class RunTaleComponent extends BaseComponent implements OnInit {
    taleId: string;

    constructor(public route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
      this.route.params.subscribe(params => {
          this.taleId = params['id'];
          console.log(`taleId is now: ${this.taleId}`);
      });
    }
}
