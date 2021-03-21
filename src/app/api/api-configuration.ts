/* tslint:disable */
import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

function getWindowApiUrl(): string {
  let window = getWindow();
  return window.env.apiUrl;
}

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfiguration {
  rootUrl: string = getWindowApiUrl();
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}
