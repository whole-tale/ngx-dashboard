import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from '@shared/core/log.service';

import { Window } from './models/window';

const ENV_URL = '/assets/env.json';

@Injectable()
export class WindowService implements Window {
  navigator: any = {};
  location: any = {};
  env: any = {};

  constructor(private readonly http: HttpClient, private readonly logger: LogService) {
    this.http.get(ENV_URL).subscribe(
      env => {
        this.env = env;
      },
      err => {
        this.logger.error('Failed to fetch env: ', err);
      }
    );
  }

  open(url: string, target?: string): void {
    return;
  }

  alert(msg: string): void {
    return;
  }

  confirm(msg: string): void {
    return;
  }
}
