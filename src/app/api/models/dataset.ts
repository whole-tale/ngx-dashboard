/* tslint:disable */

/**
 * Object representing registered data.
 */
export interface Dataset {
  /**
   * internal unique identifier
   */
  _id: string;

  /**
   * Model of the object.
   */
  _modelType: 'folder' | 'item';

  /**
   * The time when the tale was created.
   */
  created?: string;

  /**
   * A unique identifier of the user that created the tale.
   */
  creatorId?: string;
  description?: string;

  /**
   * External, unique identifier
   */
  identifier?: string;

  /**
   * A user-friendly name
   */
  name?: string;

  /**
   * Name of the provider
   */
  provider?: 'DataONE' | 'HTTP' | 'Globus';

  /**
   * Total size of the dataset in bytes.
   */
  size?: number;

  /**
   * The last time when the tale was modified.
   */
  updated?: string;
}
