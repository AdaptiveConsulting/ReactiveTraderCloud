import * as React from 'react'

import { Timer } from './Timer'
import MediaRecorder, { BlobEvent, MediaRecorderInterface } from './MediaRecorder'

export const mediaRecorderEvents = ['start', 'stop', 'dataavailable', 'pause', 'resume', 'error']

export { BlobEvent }

export interface Props {
  input: MediaStream
  mimeType?: string
  bitsPerSecond?: number
  rate?: number
  requestData?: boolean
  onStart?: (e: Event) => any
  onStop?: (e: Event) => any
  onDataAvailable?: (e: BlobEvent) => any
  onPause?: (e: Event) => any
  onResume?: (e: Event) => any
  onError?: (e: Event) => any
}

interface State {
  input?: MediaStream
  recorder?: MediaRecorderInterface

  recording: boolean
}

class MediaRecorderComponent extends React.PureComponent<Props, any> {
  static defaultProps = {
    rate: 256,
    mimeType: 'audio/webm',
    bitsPerSecond: 128 * 1000,
  }

  state: State = {
    recorder: null,

    recording: false,
  }

  async componentDidMount() {
    const { input, mimeType, bitsPerSecond } = this.props

    this.setState({
      recorder: new MediaRecorder(input, { mimeType, bitsPerSecond }),
    })
  }

  recorder: MediaRecorderInterface
  async componentDidUpdate() {
    const { recorder } = this.state

    if (recorder !== this.recorder || (recorder && recorder.state !== 'recording')) {
      this.recorder = recorder

      // Start recording, and stream subsequent events
      recorder.addEventListener('start', this.onStart)
      recorder.addEventListener('dataavailable', this.onDataAvailable)
      // Rest
      recorder.addEventListener('stop', this.onStop)
      recorder.addEventListener('pause', this.onPause)
      recorder.addEventListener('resume', this.onResume)
      recorder.addEventListener('error', this.onError)

      recorder.start()
    }
  }

  componentWillUnmount() {
    const { recorder } = this.state

    if (recorder && recorder.state === 'recording') {
      recorder.removeEventListener('start', this.onStart)
      recorder.removeEventListener('dataavailable', this.onDataAvailable)
      // Rest
      recorder.removeEventListener('stop', this.onStop)
      recorder.removeEventListener('pause', this.onPause)
      recorder.removeEventListener('resume', this.onResume)
      recorder.removeEventListener('error', this.onError)

      recorder.stop()
    }
  }

  onStart = (event: Event) => {
    this.setState({ recording: true })

    if (this.props.onStart) {
      this.props.onStart(event)
    }
  }

  chunks: Blob[] = []
  onDataAvailable = (event: any) => {
    this.chunks.push(event.data)

    if (this.props.onDataAvailable) {
      this.props.onDataAvailable(event)
    }
  }

  onStop = (event: Event) => this.props.onStop && this.props.onStop(event)
  onPause = (event: Event) => this.props.onPause && this.props.onPause(event)
  onResume = (event: Event) => this.props.onResume && this.props.onResume(event)
  onError = (event: Event) => this.props.onError && this.props.onError(event)

  onRequestDataInterval = () => {
    const { recorder } = this.state

    if (recorder) {
      recorder.requestData()
    }
  }

  render() {
    const { onDataAvailable, rate } = this.props
    const { recording } = this.state
    return (
      onDataAvailable &&
      recording && (
        // On interval pipe data to prop handler
        <Timer duration={rate} interval={this.onRequestDataInterval} />
      )
    )
  }
}

export default MediaRecorderComponent
export { MediaRecorderComponent as MediaRecorder }
