import _ from 'lodash'
import React, { PureComponent } from 'react'

import * as GreenKeyRecognition from './GreenKeyRecognition'
import { UserMediaState } from './UserMedia'

declare const MediaRecorder: any
declare const requestIdleCallback: any

export interface Props {
  audioContext: AudioContext
  userMedia: UserMediaState
  destination: MediaStreamAudioDestinationNode
  analyser: AnalyserNode
  onStart?: (e: any) => any
  onResult?: (e: any) => any
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

  socket?: boolean
  media?: boolean

  [key: string]: boolean
}

type Dependency = 'socket' | 'media'
type Source = 'socket' | 'media' | 'unmount'

export class SimpleSession extends PureComponent<Props, State> {
  async componentDidMount() {
    await this.createMediaStream()
    this.socket = await this.createSocket()
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
      console.log('recording stopped')
    },
  })

  microphone: MediaStreamAudioSourceNode

  intervalId = setInterval(() => {
    requestIdleCallback(() => this.recording && this.recorder.requestData())
  }, 500)

  async createMediaStream() {
    let mediaStream, userMediaError

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
      this.onEnd('media')
    } else {
      this.onPermission({ ok: true, source: 'media' })

      // Create the stream! 🏞
      this.microphone = this.audioContext.createMediaStreamSource(mediaStream)

      // Connect the mic 🎤
      this.microphone.connect(this.analyser)
      // And for some reason connect the analyser to the destination 📈
      this.analyser.connect(this.destination)

      this.onSourceReady('media')
    }

    return mediaStream
  }

  createSocket() {
    return GreenKeyRecognition.createWebSocket({
      onopen: () => this.onSourceReady('socket'),
      onerror: (event: ErrorEvent) => this.onError('socket', event),
      onmessage: (event: MessageEvent) => this.onMessage(event),
      onclose: async (event: CloseEvent) => {
        if (this.ready && !this.state.error) {
          this.onEnd('socket')
        }
      },
    })
  }

  async onMessage(event: MessageEvent) {
    if (!event.data) {
      return console.log('no data event', event)
    }

    if (this.props.onResult) {
      await new Promise(idle => requestIdleCallback(idle, { timeout: 160 }))

      const data = JSON.parse(event.data)

      this.props.onResult({
        data,
        transcripts: _.map(data.segments, 'clean_transcript').map(transcript => [{ transcript }]),
      })
    }
  }

  async onSourceReady(source: Source) {
    console.log('ready', { source })

    await new Promise(next => this.setState({ [source]: true }, next))

    this.onReady()
  }

  onPermission = (event: SessionEvent) => {
    console.log('onPermission', event)

    if (this.props.onPermission) {
      this.props.onPermission(event)
    }
  }

  onReady = _.debounce(() => {
    console.log('on ready')
    if (this.ready && !this.recording) {
      this.recorder.start()

      if (this.props.onStart) {
        this.props.onStart(this)
      }
    }
  }, 500)

  onError(source: Dependency, error: Error | ErrorEvent) {
    console.log('error', { source })

    this.setState({ [source]: false, error: true })
    if (this.props.onError) {
      this.props.onError({ ok: false, source, error })
    }
  }

  closed: boolean
  onEnd(source: Source) {
    console.log('onEnd', { source }, this.state)

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
