import { BaseDocument } from '~/app/framework/ngrx';

import { TaleAuthor } from './tale-author';
import { TaleDataset } from './tale-dataset';

export interface Tale extends BaseDocument {
  _id: string;
  _accessLevel: number;
  authors: Array<TaleAuthor>;
  category: string;
  copyOfTale: string;
  created: Date;
  creatorId: string;
  dataSet: Array<TaleDataset>;
  dataSetCitation: Array<any>; // TODO: sub-model
  description: string;
  folderId: string;
  icon: string;
  iframe: boolean;
  illustration: string;
  imageId: string;
  imageInfo: any;
  licenseSPDX: string;
  public: boolean;
  publishInfo: Array<any>; // TODO: sub-model
  title: string;
  updated: Date;
  workspaceId: string;

  // currently unused by frontend
  _modelType: string;
  config: any;
  format: number;
  narrative: Array<any>; // TODO: sub-model
  narrativeId: string;
}
