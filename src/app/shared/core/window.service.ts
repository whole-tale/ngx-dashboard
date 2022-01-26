import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '@api/api-configuration';
import { LogService } from '@shared/core/log.service';

import { Window } from './models/window';

const ENV_URL = '/assets/env.json';

@Injectable()
export class WindowService implements Window {
  navigator: any = {};
  location: any = {};
  env: any = {};

  constructor(private readonly http: HttpClient, private readonly config: ApiConfiguration, private readonly logger: LogService) {
    this.http.get(ENV_URL).subscribe(
      (env: any) => {
        this.env = env;
        this.config.rootUrl = env.apiUrl;
      },
      (err) => {
        this.logger.error('Failed to fetch env: ', err);
      }
    );
  }

  open(url: string, target?: string): void {
    window.open(url, target);
  }

  alert(msg: string): void {
    window.alert(msg);
  }

  confirm(msg: string): void {
    window.confirm(msg);
  }
}
