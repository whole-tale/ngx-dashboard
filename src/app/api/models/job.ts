/* tslint:disable */

/**
 * Attributes describing an item in Girder
 */
export interface Job {
  creatorId?: string;
  _id?: string;
  baseParentId?: string;
  baseParentType?: string;
  created?: string;
  _modelType?: string;
  description?: string;
  folderId?: string;
  name?: string;
  size?: number;
  updated?: string;
  progress?: any;
  status: number;
  log?: Array<string>;
}
