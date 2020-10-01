/* tslint:disable */

/**
 * A schema representing publishing information
 */
export interface PublishInfo {
  /**
   * Date Tale was published.
   */
  date: string;

  /**
   * A unique identifier assigned to this tale from a publishing source.
   */
  pid: string;

  /**
   * A URI pointing to the location of the published Tale.
   */
  uri: string;

  /**
   * Repository and Repository ID of where this data was published.
   */
  repository: string;
  repository_id: string;
}
