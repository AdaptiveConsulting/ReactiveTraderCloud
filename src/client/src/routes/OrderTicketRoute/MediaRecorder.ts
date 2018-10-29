import AudioRecorderPolyfill from 'audio-recorder-polyfill'

declare const global: any

export type MediaRecorderEvents = 'start' | 'stop' | 'dataavailable' | 'pause' | 'resume' | 'error'

export interface BlobEvent {
  data: Blob
  timecode: DOMHighResTimeStamp
}

export interface MediaRecorderInterface {
  /**
   * Returns the MIME type that was selected as the recording container for the MediaRecorder object when it was created.
   */
  readonly mimeType: string

  /**
   * Returns the current state of the MediaRecorder object (inactive, recording, or paused.)
   */
  readonly state: 'inactive' | 'recording' | 'paused'

  /**
   * Returns the stream that was passed into the constructor when the MediaRecorder was created.
   */
  readonly stream: MediaStream

  /**
   * Indicates whether the MediaRecorder instance will record input when the input MediaStreamTrack is muted. If this attribute is false, MediaRecorder will record silence for audio and black frames for video. The default is false.
   */
  ignoreMutedMedia: boolean

  /**
   * Returns the video encoding bit rate in use. This may differ from the bit rate specified in the constructor (if it was provided).
   */
  readonly videoBitsPerSecond: number

  /**
   * Returns the audio encoding bit rate in use. This may differ from the bit rate specified in the constructor (if it was provided).
   */
  readonly audioBitsPerSecond: number

  /**
   * Returns a Boolean value indicating if the given MIME type is supported by the current user agent .
   */
  isTypeSupported: () => boolean

  /**
   * Pauses the recording of media.
   */
  pause: () => void

  /**
   * Requests a Blob containing the saved data received thus far (or since the last time requestData() was called. After calling this method, recording continues, but in a new Blob.
   */
  requestData: () => void

  /**
   * Resumes recording of media after having been paused.
   */
  resume: () => void

  /**
   * Begins recording media; this method can optionally be passed a timeslice argument with a value in milliseconds. If this is specified, the media will be captured in separate chunks of that duration, rather than the default behavior of recording the media in a single large chunk.
   */
  start: () => void

  /**
   * Stops recording, at which point a dataavailable event containing the final Blob of saved data is fired. No more recording occurs.
   */
  stop: () => void

  /**
   * dataavailable
   */
  addEventListener: (
    event: MediaRecorderEvents,
    callback: (event: any | BlobEvent | MediaStreamErrorEvent) => void,
  ) => void
  removeEventListener: (
    event: MediaRecorderEvents,
    callback?: (event: any | BlobEvent | MediaStreamErrorEvent) => void,
  ) => void
}

export interface MediaRecorderOptions {
  // The mime type you want to use as the recording container for the new MediaRecorder. Applications can check in advance if this mimeType is supported by the user agent by calling MediaRecorder.isTypeSupported().
  mimeType?: string
  // The chosen bitrate for the audio and video components of the media. This can be specified instead of the above two properties. If this is specified along with one or the other of the above properties, this will be used for the one that isn't specified.
  bitsPerSecond?: number
  // The chosen bitrate for the audio component of the media.
  audioBitsPerSecond?: number
  // The chosen bitrate for the video component of the media.
  videoBitsPerSecond?: number
}

export const MediaRecorder = (global.MediaRecorder || AudioRecorderPolyfill) as {
  prototype: MediaRecorderInterface
  new (mediaStream: MediaStream, options?: MediaRecorderOptions): MediaRecorderInterface
}

export function createMediaRecorder(mediaStream: MediaStream, options: any): MediaRecorderInterface {
  return Object.assign(new MediaRecorder(mediaStream) as MediaRecorderInterface, options) as MediaRecorderInterface
}

export default MediaRecorder
