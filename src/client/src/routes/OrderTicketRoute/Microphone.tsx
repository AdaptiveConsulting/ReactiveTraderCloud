import * as React from 'react'

export interface Props {
  context: AudioContext
  mediaStream: MediaStream
  output?: AudioNode
  children?: (state: State) => any
}

export interface State {
  mediaStream?: MediaStream
  output?: AudioNode
  source?: MediaStreamAudioSourceNode
}

class Microphone extends React.PureComponent<Props, State> {
  static defaultProps = {
    mediaStream: MediaStream,
  }

  state: State = {}

  static getDerivedStateFromProps({ context, output, mediaStream }: Props, current: State) {
    let next = {}
    let source = current.source

    if (mediaStream !== current.mediaStream) {
      source = mediaStream ? context.createMediaStreamSource(mediaStream) : null

      next = { ...next, mediaStream, source }
    }

    if (source != current.source || output != current.output) {
      if (current.source && current.output) {
        current.source.disconnect(current.output)
      }

      if (output && source) {
        source.connect(output)
      }

      next = { ...next, output }
    }

    return next
  }

  componentWillUnmount() {
    const { output } = this.props
    const { source } = this.state

    if (output && source) {
      source.disconnect(output)
    }
  }

  render(): null {
    const { children } = this.props

    return (children && children(this.state)) || null
  }
}

export default Microphone
export { Microphone }
