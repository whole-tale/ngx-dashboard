/* tslint:disable */

/**
 * Attributes describing an item in Girder
 */
export interface User {
  _accessLevel?: number;
  gravatar_baseUrl?: string;

  email?: string;
  login?: string;
  firstName?: string;
  lastName?: string;

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
  otherTokens?: Array<any>;
}
