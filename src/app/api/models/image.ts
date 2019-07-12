/* tslint:disable */
import { ContainerConfig } from './container-config';

/**
 * Object representing a WT Image.
 */
export interface Image {
  /**
   * If 'true', the tale can be embedded in an iframe
   */
  iframe?: boolean;

  /**
   * internal unique identifier
   */
  _id: string;

  /**
   * The time when the image was created.
   */
  created?: string;

  /**
   * A unique identifier of the user that created the image.
   */
  creatorId?: string;
  description?: string;

  /**
   * A URL with an image icon
   */
  icon?: string;
  config?: ContainerConfig;

  /**
   * A user-friendly name
   */
  name: string;

  /**
   * ID of a previous version of the Image
   */
  parentId: string;

  /**
   * If set to true the image can be accessed by anyone
   */
  public?: boolean;

  /**
   * A human readable identification of the environment.
   */
  tags: Array<string>;

  /**
   * The last time when the image was modified.
   */
  updated?: string;
}
