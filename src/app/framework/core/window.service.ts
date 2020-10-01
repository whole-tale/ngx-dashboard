import { Window } from './models/window';

export class WindowService implements Window {
  navigator: any = {};
  location: any = {};

  open(url: string, target?: string) {
    return;
  }

  alert(msg: string): void {
    return;
  }

  confirm(msg: string): void {
    return;
  }
}
