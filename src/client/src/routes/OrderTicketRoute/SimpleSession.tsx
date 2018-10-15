import _ from 'lodash'
import React, { PureComponent } from 'react'

import * as GreenKeyRecognition from './GreenKeyRecognition'
import { UserMediaState } from './UserMedia'

declare const MediaRecorder: any
declare const requestIdleCallback: any

// const WebSocket = (window as any).WebSocket

export interface SessionResult {
  data: GreenKeyRecognition.Result
  transcripts: any
}

export interface Props {
  audioContext: AudioContext
  userMedia: UserMediaState
  destination: MediaStreamAudioDestinationNode
  analyser: AnalyserNode
  onStart?: (e: any) => any
  onResult?: (e: SessionResult) => any
  onPermission?: (event: SessionEvent) => any
  onError?: (event: SessionEvent) => any
  onEnd?: (e: any) => any
}

export interface SessionEvent {
  ok: boolean
  source: Dependency
  error?: Error | ErrorEvent
}

interface State {
  recording?: boolean
  closed?: boolean
  error?: boolean

  socket?: any
  media?: any

  [key: string]: boolean
}

type Dependency = 'socket' | 'media'
type Source = 'socket' | 'media' | 'unmount'

export class SimpleSession extends PureComponent<Props, State> {
  async componentDidMount() {
    let socket: any = this.createSocket()

    await this.createMediaStream()

    try {
      socket = await socket
    } catch (e) {
      socket = null
    }

    if (socket == null || [WebSocket.CLOSING, WebSocket.CLOSED].includes(socket.readyState)) {
      socket = await this.createSocket()
    }

    this.socket = socket
  }

  componentWillUnmount() {
    this.onEnd('unmount')
  }

  state = {
    recording: false,
    closed: false,
    error: false,
    socket: false,
    media: false,
  }

  socket: WebSocket

  get mediaStream(): MediaStream {
    return this.props.userMedia.mediaStream
  }

  get audioContext() {
    return this.props.audioContext
  }
  //   audioContext = this.props.audioContext
  get analyser() {
    return this.props.analyser
  }
  //   destination = this.audioContext.createMediaStreamDestination()
  get destination() {
    return this.props.destination
  }

  get ready() {
    const { socket, media } = this.state as any

    return !!socket && !!media
  }

  get recording() {
    return this.recorder.state === 'recording'
  }

  recorder = createMediaRecorder(this.destination.stream, {
    ondataavailable: (event: any) => {
      // push each chunk (blobs) in an array
      if (event.data instanceof Blob) {
        if (this.socket.readyState === 1) {
          this.socket.send(event.data)
        }
      }
    },
    onstop: (event: any) => {
      // console.log('recording stopped')
    },
  })

  microphone: MediaStreamAudioSourceNode

  intervalId = setInterval(() => {
    requestIdleCallback(() => this.recording && this.recorder.requestData())
  }, 500)

  async createMediaStream() {
    let mediaStream
    let userMediaError

    // Request user media, or wait 20 seconds till resolved
    for (let i = 0; !mediaStream && i < 100; i++) {
      try {
        // Await permission! 🐉
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (error) {
        if (userMediaError == null) {
          userMediaError = error
          this.onPermission({ ok: false, source: 'media', error })
        }

        await new Promise(next => setTimeout(next, 200))
      }
    }

    if (!mediaStream && userMediaError) {
      this.setSource('media', false)
      this.onEnd('media')
    } else {
      this.onPermission({ ok: true, source: 'media' })

      // Create the stream! 🏞
      this.microphone = this.audioContext.createMediaStreamSource(mediaStream)

      // Connect the mic 🎤
      this.microphone.connect(this.analyser)
      // And for some reason connect the analyser to the destination 📈
      this.analyser.connect(this.destination)

      this.setSource('media', mediaStream)
    }

    return mediaStream
  }

  async createSocket() {
    return new Promise((resolve, reject) => {
      const socket = GreenKeyRecognition.createWebSocket({
        onopen: () => {
          resolve(socket)
          this.setSource('socket', socket)
        },
        onerror: (event: ErrorEvent) => {
          reject(event)
          this.setSource('socket', false)
          this.onError('socket', event)
        },
        onmessage: (event: MessageEvent) => {
          this.onMessage(event)
        },
        onclose: async (event: CloseEvent) => {
          if (this.ready && !this.closed && !this.state.error) {
            this.setSource('socket', false)
            this.onEnd('socket')
          }
        },
      })
    })
  }

  async onMessage(event: MessageEvent) {
    if (!event.data) {
      console.warn('no data event', event)
      return
    }

    if (this.props.onResult) {
      await new Promise(idle => requestIdleCallback(idle, { timeout: 160 }))

      const data = JSON.parse(event.data)

      if (console.table && data.result && data.result.interpreted_quote) {
        console.log(`\n\n${_.repeat(`•\t`, 8)}\n\n\n`, data.result)
        console.table(flatten(data.result.interpreted_quote))
      }

      this.props.onResult({
        data,
        transcripts: _.map(data.segments, 'clean_transcript').map(transcript => [{ transcript }]),
      })
    }
  }

  setSource(source: Source, state: any) {
    // console.log('setSource', { [source]: state })

    this.setState({ [source]: state }, () => {
      if (this.ready && !this.recording) {
        this.recorder.start()

        if (this.props.onStart) {
          this.props.onStart(this)
        }
      }
    })
  }

  onPermission = (event: SessionEvent) => {
    // console.log('onPermission', event)

    if (this.props.onPermission) {
      this.props.onPermission(event)
    }
  }

  onError(source: Dependency, error: Error | ErrorEvent) {
    // console.log('error', { source })

    this.setState({ [source]: false, error: true })
    if (this.props.onError) {
      this.props.onError({ ok: false, source, error })
    }
  }

  closed: boolean
  onEnd(source: Source) {
    // console.log('onEnd', { source }, this.state)

    if (!this.closed) {
      this.closed = true
      this.destroy()
      this.setState({ live: false, closed: true })

      if (this.props.onEnd) {
        this.props.onEnd(null)
      }
    }
  }

  destroy() {
    clearInterval(this.intervalId)

    if (this.recording) {
      this.recorder.stop()
    }

    if (this.socket && this.socket.readyState === 1) {
      this.socket.send('EOS')
      this.socket.close()
    }
  }

  render(): null {
    return null
  }
}

function createMediaRecorder(mediaStream: MediaStream, options: any): typeof MediaRecorder {
  return Object.assign(new MediaRecorder(mediaStream), options)
}

export function flatten(accumulator: any, parentValue?: any, parentKey?: any): any {
  if (arguments.length === 1) {
    ;[parentValue, accumulator] = [accumulator, {}]
  }
  if (!_.isObject(parentValue) && !_.isArray(parentValue)) {
    accumulator[parentKey] = parentValue
    return accumulator
  } else {
    return _.reduce(
      parentValue,
      (a, v, k) => {
        k = _.isArray(parentValue) ? `[${k}]` : k
        return flatten(a, v, parentKey ? `${parentKey}.${k}` : k)
      },
      accumulator,
    )
  }
}
