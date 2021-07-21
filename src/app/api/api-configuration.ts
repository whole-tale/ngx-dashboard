/* tslint:disable */
import { Injectable } from '@angular/core';
import { WindowService } from '@shared/core';

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfiguration {
  rootUrl: string;

  constructor(private window: WindowService) {
    this.rootUrl = this.window.env.apiUrl;
  }
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}
