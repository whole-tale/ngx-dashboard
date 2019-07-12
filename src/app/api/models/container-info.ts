/* tslint:disable */

/**
 * A subset of docker info parameters used by Tales
 */
export interface ContainerInfo {
  created?: string;

  /**
   * Checksum of the successfully built image that was used to run this instance.
   */
  digest?: string;

  /**
   * ID of the successfully built image that was used to run this instance.
   */
  imageId?: string;
  mountPoint: string;
  name: string;
  nodeId: string;
  urlPath?: string;
  volumeName: string;
}
