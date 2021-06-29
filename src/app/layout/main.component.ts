import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@shared/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent extends BaseComponent {
  route = '';

  constructor(location: Location, router: Router) {
    super();

    router.events.subscribe(val => {
      if (location.path() !== '') {
        this.route = location.path();
      }
    });
  }

  onActivate(event$: any, scrollContainer: any): void {
    scrollContainer.scrollTop = 0;
  }
}
