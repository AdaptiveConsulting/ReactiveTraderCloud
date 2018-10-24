import React from 'react'

declare const global: any

const GlobalAudioContext = (global.AudioContext || global.webkitAudioContext) as {
  prototype: AudioContext
  new (contextOptions?: AudioContextOptions): AudioContext
}

export default GlobalAudioContext
export { GlobalAudioContext as AudioContext }

export const Context = React.createContext<AudioContext>(new GlobalAudioContext())
