declare const global: any

export default (global.AudioContext || global.webkitAudioContext) as {
  prototype: AudioContext
  new (contextOptions?: AudioContextOptions): AudioContext
}
