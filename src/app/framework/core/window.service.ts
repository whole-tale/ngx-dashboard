import { Window } from './models/window';

export class WindowService implements Window {
  navigator: any = {};
  location: any = {};
  env: any = {};

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
