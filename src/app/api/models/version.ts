/* tslint:disable */

/**
 *
 * Example Version value:

{
  "_accessLevel": 2,
  "_id": "5f887e9981d63263a60a65c3",
  "_modelType": "folder",
  "baseParentId": "5f887d3b81d63263a60a65a6",
  "baseParentType": "collection",
  "created": "2020-10-15T16:53:45.345335+00:00",
  "creatorId": "5f887c6a81d63263a60a657f",
  "description": "",
  "isMapping": true,
  "name": "test via API",
  "parentCollection": "folder",
  "parentId": "5f887d8e81d63263a60a65ba",
  "public": false,
  "size": 0,
  "updated": "2020-10-15T16:53:45.345335+00:00"
}
*/

/**
 * Attributes describing a version of a Tale in Girder
 */
export interface Version {
  // Context-specific access levels
  _accessLevel?: number;
  access?: any;

  // ID / modelType are standard on all Girder models
  _id?: string;
  _modelType?: string;

  // Inherited from Folder model
  baseParentId?: string;
  baseParentType?: string;
  created?: string;
  creatorId?: string;
  description?: string;
  name?: string;
  parentCollection?: string;
  parentId?: string;
  public?: boolean;
  size?: number;
  updated?: string;

  // TODO: What is this?
  isMapping?: boolean;
}
