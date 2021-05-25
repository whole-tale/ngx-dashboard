/* tslint:disable */
import { ContainerInfo } from './container-info';

export interface Instance {
  /**
   * If "true", instance can be embedded in an iframe
   */
  iframe?: boolean;
  _accessLevel: number;
  _modelType: string;
  containerInfo?: ContainerInfo;
  created: string;
  creatorId?: string;
  _id: string;
  lastActivity: string;
  name?: string;

  /**
   * Status of the Instance.
   *   0 => LAUNCHING
   *   1 => RUNNING
   *   2 => ERROR
   *   3 => DELETING
   */
  status: number;
  taleId?: string;
  url?: string;
}
