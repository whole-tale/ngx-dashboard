import { BaseDocument } from '~/app/framework/ngrx';

export interface FileElement extends BaseDocument {
  // present on all of folders, items, collections, and datasets
  _id: string;
  _modelType: string;
  created: Date;
  description: string;
  name: string;
  size: number;
  updated: Date;

  // present only on folders, items, and datasets
  creatorId: string;

  // present only on folders and items
  baseParentId: string;
  baseParentType: string;

  // folders and collections only
  _accessLevel: number;
  public: boolean;

  // folders only
  parentCollection: string;
  parentId?: string;

  // items only
  folderId: string;

  // datasets only
  provider: string;
}

export class FileElement implements FileElement {
  // present on all of folders, items, collections, and datasets
  _id: string;
  _modelType: string;
  created: Date = new Date();
  description = '';
  name: string;
  size = 0;
  updated: Date = new Date();

  // present only on folders, items, and datasets
  creatorId: string;

  // present only on folders and items
  baseParentId: string;
  baseParentType = 'user';

  // folders and collections only
  _accessLevel = -1;
  public = false;

  // folders only
  parentCollection = 'folder';
  parentId?: string;

  // items only
  folderId: string;

  // datasets only
  provider: string;
}
