// NOTE: "Event" is already a built-in type name
export interface GirderEvent {
  // Error details
  errorCode: number;
  errorMessage: string;

  target: {}; // The EventSource that received this message
  data: string; // JSON.stringified EventData (see event-data.ts)
  type: string; // Girder message type (e.g. "message")
}
