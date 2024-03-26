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
  authProvider: string;

  constructor() {
    this.rootUrl = window.env.apiUrl;
    this.authProvider = window.env.authProvider;
  }
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
  authProvider?: string;
}
