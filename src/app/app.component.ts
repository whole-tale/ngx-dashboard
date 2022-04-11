import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BaseComponent } from '@shared/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent {
  constructor(private readonly titleService: Title, private readonly metaService: Meta) {
    super();
    this.setTitle('WholeTale Dashboard');
    this.metaService.updateTag({
      name: 'description',
      content: 'Changing meta tags using an Angular service',
    });
  }
  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }
}
