/* tslint:disable */
import { ContainerConfig } from './container-config';
import { DataSet } from './data-set';
import { ImageInfo } from './image-info';
import { PublishInfo } from './publish-info';
import { TaleAuthor } from '@tales/models/tale-author';

/**
 * Object representing a Tale.
 */
export interface Tale {
  /**
   * If 'true', the tale can be embedded in an iframe
   */
  iframe?: boolean;

  /**
   * internal unique identifier
   */
  _id?: string;

  /**
   * Access level for this resource.
   *   -1 => Public
   *   0 => None
   *   1 => Read
   *   2 => Write
   */
  _accessLevel?: number;

  _modelType?: string;

  /**
   * Keyword describing topic of the Tale
   */
  category: string;
  config?: ContainerConfig;

  /**
   * An ID of a source Tale, if the Tale is a copy.
   */
  copyOfTale?: string;

  /**
   * The time when the tale was created.
   */
  created?: string;

  /**
   * A unique identifier of the user that created the tale.
   */
  creatorId?: string;
  dataSet: DataSet;

  /**
   * The description of the Tale (Markdown)
   */
  description: string;

  /**
   * ID of a folder containing copy of tale['dataSet']
   */
  folderId?: string;

  /**
   * Tale format specification
   */
  format?: number;

  /**
   * A URL to an image icon
   */
  icon?: string;

  /**
   * A list of authors that are associated with the Tale
   */
  authors: Array<TaleAuthor>;

  /**
   * A URL to an image depicturing the content of the Tale
   */
  illustration?: string;

  /**
   * ID of a WT Image used by the Tale
   */
  imageId: string;
  imageInfo?: ImageInfo;

  /**
   * The license that the Tale is under
   */
  license: string;

  /**
   * List of Girder Items containing Tale's narrative
   */
  narrative?: Array<string>;

  /**
   * ID of a folder containing copy of tale['narrative']
   */
  narrativeId?: string;

  /**
   * If set to true the Tale is accessible by anyone.
   */
  public: boolean;
  publishInfo: Array<PublishInfo>;

  /**
   * DOIs and other identifiers related to this Tale.
   */
  relatedIdentifiers?: Array<any>;

  /**
   * Title of the Tale
   */
  title?: string;

  /**
   * The last time when the tale was modified.
   */
  updated?: string;

  /**
   * ID of a folder containing Tale's workspace
   */
  workspaceId?: string;

  /**
   * ID of a folder containing the Tale's Versions and Recorded Runs
   */
  runsRootId: string;
  versionsRootId: string;

  /**
   * The ID of the version from which this Tale was restored.
   * If null, then we are at the newest available version/snapshot (e.g. HEAD)
   */
  restoredFrom?: string;
}
