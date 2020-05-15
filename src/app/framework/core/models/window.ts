export interface Window {
  navigator: any;
  location: any;
  URL: any;

  alert(msg: string): void;
  open(url: string, target?: string): void;
  confirm(msg: string): void;
}
