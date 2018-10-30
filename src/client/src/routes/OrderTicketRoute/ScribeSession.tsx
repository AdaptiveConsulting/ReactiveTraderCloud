import _ from 'lodash'
import React, { PureComponent } from 'react'

import MediaRecorder, { BlobEvent, MediaRecorderInterface } from './MediaRecorder'

import * as GreenKeyRecognition from './GreenKeyRecognition'
import { Timer } from './Timer'

import { WebSocketConnection, WebSocketEventHandles } from './WebSocketConnection'

export interface SessionResultData extends GreenKeyRecognition.Result {}
export interface SessionResult {
  data: GreenKeyRecognition.Result
  transcripts: any
}

export interface Props {
  input: MediaStream
  mimeType: string
  bitsPerSecond: number
  onStart?: (event: any) => any
  onBlob?: (event: BlobEvent) => any
  onError?: (event: SessionEvent) => any
  onResult?: (event: SessionResult) => any
  onEnd?: (event: any) => any
}

interface State {
  input?: MediaStream
  recorder?: MediaRecorderInterface
  socket?: any

  connected: boolean
  recording: boolean

  error?: boolean
  result?: GreenKeyRecognition.Result
}

export interface SessionEvent {
  ok: boolean
  source: Dependency
  error?: Error | ErrorEvent
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
  }

  recorder: MediaRecorderInterface
  start() {
    const { recorder } = this.state

    if (recorder !== this.recorder || (recorder && recorder.state !== 'recording')) {
      this.recorder = recorder

      if (this.props.onStart) {
        this.props.onStart(this)
      }

      // Start recording, and stream subsequent events
      recorder.addEventListener('start', () => this.setState({ recording: true }))
      recorder.addEventListener('dataavailable', this.onAudioData)
      recorder.start()
    }
  }

  chunks: Blob[] = []
  onAudioData = (event: any) => {
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

  onOpen = ({ target }: Event) => {
    this.setState({ socket: target, connected: true })
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

  onError = (error: Error | ErrorEvent) => {
    if (this.unmounting) {
      console.error('Unexpected call to ScribeSession.onError')
      return
    } else {
      this.setState({
        error: true,
        socket: null,
        connected: false,
      })

      if (this.props.onError) {
        this.props.onError({ ok: false, source: 'socket', error })
      }
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
        this.props.onEnd(null)
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

        {result &&
          result.final && (
            // Provide time 1s window for user to continue speaking
            <Timer duration={1000} timeout={this.onMarkedFinalTimeout} />
          )}
      </React.Fragment>
    )
  }
}

export default ScribeSession
