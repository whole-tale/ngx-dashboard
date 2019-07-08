import { BaseDocument } from '~/app/framework/ngrx';

export interface TaleAuthor extends BaseDocument {
  firstName: string;
  lastName: string;
  orcid: string;
}
