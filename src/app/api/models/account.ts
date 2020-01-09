/* tslint:disable */

/**
 * Attributes describing an external Account in Girder
 */
export interface Account {
  docs_href?: string;
  fullName: string;
  name: string;
  logo?: string;
  tags?: Array<string>;
  targets?: Array<any>;
  state?: string;
  type: string;
  url?: string;
}
