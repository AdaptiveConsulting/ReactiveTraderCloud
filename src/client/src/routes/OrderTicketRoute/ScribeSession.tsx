import _ from 'lodash'
import React, { PureComponent } from 'react'

import MediaRecorder from './MediaRecorder'

import * as GreenKeyRecognition from './GreenKeyRecognition'
import { Timer } from 'rt-components'

import { WebSocketConnection, WebSocketEventHandles } from './WebSocketConnection'

// tslint:disable-next-line
export interface SessionResultData extends GreenKeyRecognition.Result {}
export interface SessionResult {
  data: GreenKeyRecognition.Result
  transcripts: any
}

export interface Props {
  input: MediaStream
  mimeType: string
  bitsPerSecond: number
  onStart?: () => void
  onBlob?: (event: BlobEvent) => void
  onError?: (event: SessionEvent) => void
  onResult?: (event: SessionResult) => void
  onEnd?: () => void
}

interface State {
  input?: MediaStream
  recorder?: MediaRecorder
  socket?: WebSocket

  connected: boolean
  recording: boolean

  error?: boolean
  result?: GreenKeyRecognition.Result
}

export interface SessionEvent {
  ok: boolean
  source: Dependency
  error?: Event
}

type Dependency = 'socket'

export class ScribeSession extends PureComponent<Props, State> {
  static defaultProps = {
    mimeType: 'audio/webm;codecs=opus',
    bitsPerSecond: 128 * 1000,
  }

  static getDerivedStateFromProps({ input, mimeType, bitsPerSecond }: Props, { input: lastInput, recorder }: State) {
    if (input === lastInput && recorder) {
      return null
    }

    return {
      input,
      recorder: new MediaRecorder(input, { mimeType, bitsPerSecond }),
    }
  }

  state: State = {
    recorder: null,
    socket: null,

    recording: false,
    connected: false,

    error: false,
    result: null,
  }

  async componentDidMount() {
    this.start()
  }

  async componentDidUpdate() {
    this.start()
  }

  unmounting: boolean
  componentWillUnmount() {
    this.unmounting = true

    const { recorder, socket } = this.state

    if (recorder && recorder.state === 'recording') {
      recorder.stop()
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close()
    }

    recorder.removeEventListener('start', this.startRecording)
    recorder.removeEventListener('dataavailable', this.onAudioData)
  }

  recorder: MediaRecorder
  start() {
    const { recorder } = this.state

    if (recorder !== this.recorder || (recorder && recorder.state !== 'recording')) {
      this.recorder = recorder

      if (this.props.onStart) {
        this.props.onStart()
      }

      // Start recording, and stream subsequent events
      recorder.addEventListener('start', this.startRecording)
      recorder.addEventListener('dataavailable', this.onAudioData)
      recorder.start()
    }
  }

  startRecording = () => {
    this.setState({ recording: true })
  }

  chunks: Blob[] = []
  onAudioData = (event: BlobEvent) => {
    const { onBlob } = this.props
    const { socket } = this.state

    this.chunks.push(event.data)

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(event.data)
    }

    if (onBlob) {
      onBlob(event)
    }
  }

  createWebSocket = (handles: WebSocketEventHandles) =>
    GreenKeyRecognition.createWebSocket({ contentType: this.props.mimeType, ...handles })

  onOpen = (socket: WebSocket) => {
    this.setState({ socket, connected: true })
  }

  onMessage = (event: MessageEvent) => {
    if (this.unmounting) {
      console.error('ScribeSession.onMessage occured after unmount')

      return
    }

    const data = JSON.parse(event.data)
    this.setState({ result: data.result })

    if (this.props.onResult) {
      this.props.onResult({
        data,
        transcripts: _.map(data.segments, 'clean_transcript').map(transcript => [{ transcript }]),
      })
    }
  }

  onRequestDataInterval = () => {
    const { recorder, socket } = this.state

    if (socket && [WebSocket.CONNECTING, WebSocket.OPEN].includes(socket.readyState)) {
      recorder.requestData()
    }
    // This is an unexpected condition
    else if (socket && [WebSocket.CLOSED, WebSocket.CLOSING].includes(socket.readyState)) {
      console.error('Reached unexpected state in ScribeSession', socket)
    }
  }

  onError = (error: Event) => {
    if (this.unmounting) {
      console.error('Unexpected call to ScribeSession.onError')
      return
    }

    this.setState({
      error: true,
      socket: null,
      connected: false,
    })

    if (this.props.onError) {
      this.props.onError({ ok: false, source: 'socket', error })
    }
  }

  onMarkedFinalTimeout = () => {
    console.info('Marked final')

    this.onClose()
  }

  onClose = () => {
    if (this.unmounting) {
      console.warn('ScribeSession', 'onClose', 'skipped')
      return
    }

    this.setState({ socket: null, connected: false, recording: false }, () => {
      if (this.props.onEnd) {
        this.props.onEnd()
      }
    })
  }

  render() {
    const { recording, connected, result } = this.state

    return (
      <React.Fragment>
        {recording && (
          <WebSocketConnection
            create={this.createWebSocket}
            onOpen={this.onOpen}
            onMessage={this.onMessage}
            onError={this.onError}
            onClose={this.onClose}
          />
        )}

        {connected && (
          // Pipe data over socket on interval
          <Timer duration={GreenKeyRecognition.interval} interval={this.onRequestDataInterval} />
        )}

        {result && result.final && (
          // Provide time 1s window for user to continue speaking
          <Timer duration={1000} timeout={this.onMarkedFinalTimeout} />
        )}
      </React.Fragment>
    )
  }
}

export default ScribeSession
