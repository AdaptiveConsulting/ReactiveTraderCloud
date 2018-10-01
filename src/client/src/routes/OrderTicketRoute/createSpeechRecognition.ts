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

BrowserSpeechRecognition.prototype.serviceURI = 'http://localhost:1337'
;(BrowserSpeechRecognition.prototype as any).speechURI = 'http://localhost:1337'

BrowserSpeechRecognition.serviceURI = 'http://localhost:1337'
BrowserSpeechRecognition.speechURI = 'http://localhost:1337'

export function createSpeechRecognition(props: Partial<SpeechRecognition>): SpeechRecognition {
  const instance = new BrowserSpeechRecognition()

  console.log(instance.serviceURI)
  console.log((instance as any).speechURI)

  Object.assign(instance, {
    // lang: 'en-US',
    serviceURI: 'http://localhost:1337',
    speechURI: 'http://localhost:1337',
    ...props,
  })

  return instance
}

export default createSpeechRecognition
