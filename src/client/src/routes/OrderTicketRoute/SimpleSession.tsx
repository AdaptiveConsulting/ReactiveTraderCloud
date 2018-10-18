import _ from 'lodash'
import React, { PureComponent } from 'react'

import MediaRecorder, { BlobEvent, MediaRecorderInterface } from './MediaRecorder'
import requestIdleCallback from './requestIdleCallback'

import * as GreenKeyRecognition from './GreenKeyRecognition'
import { Timer } from './Timer'
import { UserMediaState } from './UserMedia'

const IDLE_PROPS = {
  timeout: GreenKeyRecognition.interval / 2,
}

// const WebSocket = (window as any).WebSocket

export interface SessionResultData extends GreenKeyRecognition.Result {}
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

  result?: GreenKeyRecognition.Result

  [key: string]: any
}

type Dependency = 'socket' | 'media'
type Source = 'socket' | 'media' | 'unmount'

export class SimpleSession extends PureComponent<Props, State> {
  state: State = {
    recording: false,
    closed: false,
    error: false,
    socket: false,
    media: false,

    result: null,
  }

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
    return this.recorder && this.recorder.state === 'recording'
  }

  socket: WebSocket & GreenKeyRecognition.WebSocketProps
  recorder: MediaRecorderInterface

  async componentDidMount() {
    let mediaStream: any = this.createMediaStream()
    let socket: any = this.createSocket()

    // Close socket on timeout / user interaction
    try {
      mediaStream = await Promise.race([mediaStream, new Promise((_, reject) => setTimeout(reject, 500))])
      socket = await socket
    } catch (e) {
      mediaStream = await mediaStream
      socket = await socket
      socket.close()
    }

    // Create recorder and generate first BlobEvent
    this.recorder = new MediaRecorder(this.destination.stream)
    const event = await new Promise<BlobEvent>(next => {
      this.recorder.addEventListener('dataavailable', next)
      this.recorder.start()
      this.recorder.requestData()
    })

    // Ensure socket content-type matches blob content type
    // Or, open new connection if socket closed prematurely
    if (event.data.type !== socket.contentType || [WebSocket.CLOSED, WebSocket.CLOSING].includes(socket.readyState)) {
      socket.close()
      socket = await this.createSocket({
        contentType: event.data.type,
      })
    }

    // Send first payload
    this.socket = socket
    this.socket.send(event.data)
    // Stream subsequent events
    this.recorder.addEventListener('dataavailable', event => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(event.data)
      }
    })

    // Mount stream interval
    this.setState({
      socket: this.socket,
      requestDataStream: true,
    })
  }

  componentWillUnmount() {
    this.onEnd('unmount')
  }

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

      this.audioContext
        // Create the stream! 🏞
        .createMediaStreamSource(mediaStream)
        // Connect the mic 🎤
        .connect(this.analyser)
      // And for some reason connect the analyser to the destination 📈
      this.analyser.connect(this.destination)

      this.setSource('media', mediaStream)
    }

    return mediaStream
  }

  async createSocket(options?: GreenKeyRecognition.WebSocketProps) {
    return new Promise<WebSocket & GreenKeyRecognition.WebSocketProps>((resolve, reject) => {
      const socket = GreenKeyRecognition.createWebSocket({
        ...options,
        onopen: () => {
          resolve(socket)
          // this.setSource('socket', socket)
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
    await new Promise(next => requestIdleCallback(next, IDLE_PROPS))

    if (this.state.unmount) {
      console.error('SimpleSession.onMessage occured after unmount')

      return
    }

    const data = JSON.parse(event.data)
    this.setState({
      data,
      result: data.result,
    })

    if (this.props.onResult) {
      this.props.onResult({
        data,
        transcripts: _.map(data.segments, 'clean_transcript').map(transcript => [{ transcript }]),
      })
    }

    // requestIdleCallback(() => {
    //   if (console.table && data.result) {
    //     console.log(`\n\n${_.repeat(`•\t`, 8)}\n\n\n`, data.result)
    //     // console.table(_.omitBy(flatten(data.result), (v, k) => /lattice_path|TimeSec/.test(k)))
    //     console.table(flatten(data.result))
    //   }
    // }, IDLE_PROPS)
  }

  setSource(source: Source, state: any) {
    this.setState({ [source]: state }, () => {
      if (this.state.media && !this.recording) {
        // this.recorder.start()
        if (this.props.onStart) {
          this.props.onStart(this)
        }
      }
    })
  }

  onPermission = (event: SessionEvent) => {
    if (this.props.onPermission) {
      this.props.onPermission(event)
    }
  }

  onRequestDataInterval = () => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.recorder.requestData()
    } else {
      console.error('Reached unexpected state in SimpleSession')
    }
  }

  onMarkedFinalTimeout = () => {
    console.warn('Marked final')
    this.onEnd('socket')
  }

  onError(source: Dependency, error: Error | ErrorEvent) {
    this.setState({ [source]: false, error: true })
    if (this.props.onError) {
      this.props.onError({ ok: false, source, error })
    }
  }

  closed: boolean
  onEnd(source: Source) {
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
    if (this.recording) {
      this.recorder.stop()
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close()
    }
  }

  render() {
    const { socket, result } = this.state
    return (
      <React.Fragment>
        {socket &&
          socket.readyState === WebSocket.OPEN && (
            <Timer duration={GreenKeyRecognition.interval} interval={this.onRequestDataInterval} />
          )}
        {result && result.final && <Timer duration={1000} timeout={this.onMarkedFinalTimeout} />}
      </React.Fragment>
    )
  }
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
