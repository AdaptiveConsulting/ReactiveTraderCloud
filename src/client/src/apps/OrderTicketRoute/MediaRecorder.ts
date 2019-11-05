import AudioRecorderPolyfill from 'audio-recorder-polyfill'

declare const global: Window

export type MediaRecorderEventType =
  | 'start'
  | 'stop'
  | 'dataavailable'
  | 'pause'
  | 'resume'
  | 'error'

declare global {
  // Augment MediaRecorder type with strongly typed methods
  interface MediaRecorder {
    addEventListener<T extends Event>(
      eventType: MediaRecorderEventType,
      callback: (event: T) => void | null,
    ): void
    removeEventListener<T extends Event>(
      eventType: MediaRecorderEventType,
      callback: (event: T) => void,
    ): void
  }
}

const MediaRecorder =
  global.MediaRecorder ||
  (AudioRecorderPolyfill as {
    prototype: MediaRecorder
    new (mediaStream: MediaStream, options?: MediaRecorderOptions): MediaRecorder
  })

export default MediaRecorder
