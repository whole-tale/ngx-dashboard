import { Tale } from '@api/models/tale';

export interface FileElement {
  // present on all of folders, items, collections, and datasets
  _id: string;
  _modelType: string;
  created: Date;
  description: string;
  name: string;
  size: number;
  updated: Date;

  // upload progress
  uploadProgress: number;
  uploading: boolean;

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

  // upload progress
  uploadedBytes = 0;
  uploading = false;

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

  constructor(tale?: Tale, root?: FileElement) {
    // allow to construct Workspace folder with a Tale name from Tale object
    // the same trick could be later used for other aux folders.
    if (tale) {
      this._id = tale.workspaceId;
      this._modelType = 'folder';
      this.created = new Date(tale.created);
      this.description = tale.description;
      this.name = tale.title;
      this.updated = new Date(tale.updated);
      this.creatorId = tale.creatorId;
      this.baseParentId = root.baseParentId;
      this.baseParentType = root.baseParentType;
      this._accessLevel = tale._accessLevel;
      this.public = tale.public;
      this.parentId = root._id;
    }
  }
}
