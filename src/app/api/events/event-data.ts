/**
 * This is the JSON payload of a GirderEvent
 * (see girder-event.ts)
 */
export interface EventData {
  // ID of this message
  _id: string;

  // Current time on the Girder server
  _girderTime: number;

  // Type of the message (we are only interested in type=="wt_progress")
  type: string;

  // Who is this message for?
  userId: string;

  // Timing attributes for this message
  startTime: number;
  expires: Date;
  time: Date;
  updated: Date;
  updatedTime: number;

  // Data payload for the message
  data: {
    /* type=wt_tale_updated */
    modelType?: string; // The type of model this update affects

    // Message payload
    state: string; // status of the overall operation
    title: string; // unused - effectively a friendly job name= (e.g. "Creating instance")

    // Progress indication
    current: number; // Current step number
    total: number; // Total step number
    message: string; // Step progress message

    // Time indication
    estimateTime: boolean; // True if a time estimate is provided

    // Our custom resource, which includes associated IDs relevant to this message
    event: string;
    resourceName: string;
    resource:
      | any
      | string
      | {
          /* type=wt_progress */
          instance_id?: string; // ID of the Instance for which this message is relevant
          jobs?: Array<string>; // Job IDs associated with this progress update
          tale_id?: string; // ID of the Tale for which this message is relevant
          tale_title?: string; // Title of the Tale
          type?: string; // WT job name (e.g. "wt_create_instance")
        };
  };
}
