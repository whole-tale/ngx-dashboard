export interface Window {
  navigator: any;
  location: any;
  env: any;

  alert(msg: string): void;
  open(url: string, target?: string): void;
  confirm(msg: string): void;
}
