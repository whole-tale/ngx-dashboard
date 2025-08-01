// NOTE: "Event" is already a built-in type name

import { EventData } from './event-data';

export interface GirderEvent {
  // Error details
  _id?: string;
  errorCode: number;
  errorMessage: string;
  estimateTime: boolean; // true if the event has an estimated time of completion
  startTime: number; // Estimated time in seconds
  data: EventData; // The actual event data payload
  type: string; // Girder message type (e.g. "message")
}
