import { Injectable } from '@angular/core';

import { Window } from './models/window';

@Injectable()
export class WindowService implements Window {
  navigator: any = {};
  location: any = {};
  env: any = {}; // loaded from src/assets/env.js

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
