import _ from 'lodash'

import { SpeechRecognition } from './types'

export interface SpeechRecognitionClass {
  prototype: SpeechRecognition
  new (): SpeechRecognition
  serviceURI: string
  speechURI: string
}

export declare const global: any

const BrowserSpeechRecognition: SpeechRecognitionClass = global.SpeechRecognition || global.webkitSpeechRecognition

// Does not work ☹️
// BrowserSpeechRecognition.prototype.serviceURI = 'http://localhost:1337'
// BrowserSpeechRecognition.serviceURI = 'http://localhost:1337'

export function createSpeechRecognition(props: Partial<SpeechRecognition>): SpeechRecognition {
  const instance = new BrowserSpeechRecognition()

  Object.assign(instance, {
    lang: 'en-US',
    ...props,
  })

  return instance
}

export default createSpeechRecognition
