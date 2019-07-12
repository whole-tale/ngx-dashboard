/* tslint:disable */

/**
 * A container with a list of filenames and sizes from a DataONE repository.
 */
export interface FileMap {
  /**
   * The name of the data file.
   */
  name: string;

  /**
   * Size of the file in bytes.
   */
  size?: number;
}
