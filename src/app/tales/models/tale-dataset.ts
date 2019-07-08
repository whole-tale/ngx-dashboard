import { BaseDocument } from '~/app/framework/ngrx';

export interface TaleDataset extends BaseDocument {
  _modelType: string;
  itemId: string;
  mountPath: string;
}
