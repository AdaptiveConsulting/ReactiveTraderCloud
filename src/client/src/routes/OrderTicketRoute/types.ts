/**
 * Copied from typescript@next lib.dom.d.ts
 * https://raw.githubusercontent.com/Microsoft/TypeScript/master/lib/lib.dom.d.ts
 *
 * To be removed upon release of typescript@next
 */

type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported'

export interface SpeechGrammar {
  src: string
  weight: number
}

export declare var SpeechGrammar: {
  prototype: SpeechGrammar
  new (): SpeechGrammar
}

export interface SpeechGrammarList {
  readonly length: number
  addFromString(string: string, weight?: number): void
  addFromURI(src: string, weight?: number): void
  item(index: number): SpeechGrammar
  [index: number]: SpeechGrammar
}

export declare var SpeechGrammarList: {
  prototype: SpeechGrammarList
  new (): SpeechGrammarList
}

export interface SpeechRecognitionEventMap {
  audioend: Event
  audiostart: Event
  end: Event
  error: SpeechRecognitionError
  nomatch: SpeechRecognitionEvent
  result: SpeechRecognitionEvent
  soundend: Event
  soundstart: Event
  speechend: Event
  speechstart: Event
  start: Event
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean
  grammars: SpeechGrammarList
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  serviceURI: string
  abort(): void
  start(): void
  stop(): void
  addEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void
  removeEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void
}

export declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

export interface SpeechRecognitionAlternative {
  readonly confidence: number
  readonly transcript: string
}

export declare var SpeechRecognitionAlternative: {
  prototype: SpeechRecognitionAlternative
  new (): SpeechRecognitionAlternative
}

export interface SpeechRecognitionError extends Event {
  readonly error: SpeechRecognitionErrorCode
  readonly message: string
}

export declare var SpeechRecognitionError: {
  prototype: SpeechRecognitionError
  new (): SpeechRecognitionError
}

export interface SpeechRecognitionEvent extends Event {
  readonly emma: Document | null
  readonly interpretation: any
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

export declare var SpeechRecognitionEvent: {
  prototype: SpeechRecognitionEvent
  new (): SpeechRecognitionEvent
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

export declare var SpeechRecognitionResult: {
  prototype: SpeechRecognitionResult
  new (): SpeechRecognitionResult
}

export interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

export declare var SpeechRecognitionResultList: {
  prototype: SpeechRecognitionResultList
  new (): SpeechRecognitionResultList
}

export interface SpeechSynthesisEventMap {
  voiceschanged: Event
}
