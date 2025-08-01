/**
 * This is the JSON payload of a GirderEvent
 * (see girder-event.ts)
 */
export interface EventData {
  // ID of this message
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
  affectedResourceIds: {
    instanceId: string;
    taleId: string;
  };
  resource: {
    /* type=wt_progress */
    _id?: string; // ID of the resource this message is about
    instance_id?: string; // ID of the Instance for which this message is relevant
    jobs?: Array<string>; // Job IDs associated with this progress update
    tale_id?: string; // ID of the Tale for which this message is relevant
    tale_title?: string; // Title of the Tale
    type?: string; // WT job name (e.g. "wt_create_instance")
  };
}
