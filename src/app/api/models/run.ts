/* tslint:disable */

export interface Run {
  _accessLevel: number;
  _id: string;
  _modelType: string;

  creatorId: string;
  created: string;
  updated: string;

  // File-like properties
  baseParentId: string;
  baseParentType: string;
  parentCollection: string;
  parentId: string;
  size: number;

  // Unique properties
  name: string;
  description: string;
  isMapping: boolean;
  public: boolean;
  runStatus: number;
  runVersionId: string;
}

export enum RunStatus {
  UNKNOWN,
  STARTING,
  RUNNING,
  COMPLETED,
  FAILED,
  CANCELLED,
}
