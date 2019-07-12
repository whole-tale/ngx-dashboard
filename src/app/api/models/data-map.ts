/* tslint:disable */

/**
 * A container with a basic information about a set of external data resources.
 */
export interface DataMap {
  /**
   * External dataset identificator, such as URL.
   */
  dataId: string;

  /**
   * Digital Object Identifier
   */
  doi: string;

  /**
   * A user-friendly name. Defaults to the name provided by an external repository.
   */
  name: string;

  /**
   * Name of a data repository holding the dataset.
   */
  repository: string;

  /**
   * Size of the dataset in bytes.
   */
  size: number;
}
