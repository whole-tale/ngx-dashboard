export interface Window {
  navigator: any;
  location: any;

  alert(msg: string): void;
  open(url: string, target?: string): void;
  confirm(msg: string): void;
}
