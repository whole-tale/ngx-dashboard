export interface Console {
  log(m: any, c?: any): void;

  debug(m: any, c?: any): void;

  error(m: any, c?: any): void;

  warn(m: any, c?: any): void;

  info(m: any, c?: any): void;
}
