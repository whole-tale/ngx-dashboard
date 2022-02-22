/* tslint:disable */

export interface Run {
  _accessLevel: number;
  _id: string;
  _modelType: string;

  creatorId: string;
  created: Date;
  updated: Date;

  // File-like properties
  baseParentId: string;
  baseParentType: string;
  parentCollection: string;
  parentId: string;
  size: number;

  // Unique properties
  name: string;
  prevName: string; // for rolling back failed rename
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
