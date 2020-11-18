/* tslint:disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfiguration {
  rootUrl: string = 'https://girder.local.wholetale.org/api/v1';
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}
