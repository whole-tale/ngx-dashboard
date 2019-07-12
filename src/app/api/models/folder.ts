/* tslint:disable */

/**
 * Attributes describing a folder in Girder
 */
export interface Folder {
  description?: string;
  _accessLevel?: string;
  _modelType?: string;
  baseParentId?: string;
  baseParentType?: string;
  created?: string;
  creatorId?: string;
  _id?: string;
  name?: string;
  parentCollection?: string;
  parentId?: string;
  public?: boolean;
  size?: number;
  updated?: string;
}
