/* tslint:disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl: string;

  constructor() {
    // tslint:disable-next-line:no-string-literal
    this.rootUrl = window['env']['apiUrl'];
  }
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}
