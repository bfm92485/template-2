export const SOCKET_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const LiveTranscriptionEvents = {
  OPEN: 'open',
  CLOSE: 'close',
  TRANSCRIPT_RECEIVED: 'transcriptReceived',
  ERROR: 'error',
};

export const createClient = () => ({
  listen: {
    live: { start: async () => ({ finish: () => {} }) },
  },
});

export type LiveSchema = any;
export type LiveTranscriptionEvent = any;