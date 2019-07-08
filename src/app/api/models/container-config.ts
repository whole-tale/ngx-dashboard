/* tslint:disable */

/**
 * A subset of docker runtime configuration used for Tales
 */
export interface ContainerConfig {
  /**
   * Command to run when the container starts
   */
  command?: string;
  cpuShares?: string;

  /**
   * List of environment variables passed to a container
   */
  environment?: Array<string>;
  memLimit?: string;

  /**
   * The exposed internal port that is going to be accessbile through HTTP(S)
   */
  port?: number;

  /**
   * Path where the Whole Tale filesystem will be mounted
   */
  targetMount?: string;

  /**
   * Subpath appended to the randomly generated container URL
   */
  urlPath?: string;

  /**
   * Username used inside the running container
   */
  user?: string;
}
