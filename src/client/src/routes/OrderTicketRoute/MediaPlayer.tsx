import * as React from 'react'

export interface Props {
  src?: string
  at?: number
  play?: boolean
  context: AudioContext
  destination: AudioNode
}

export interface State {
  active?: boolean
  buffer?: AudioBuffer
  playback: {
    position: number
    pausedAt: number
  }
  source?: AudioBufferSourceNode
}

class MediaPlayer extends React.PureComponent<Props, State> {
  static defaultProps = {
    src: '/test.ogg',
    at: 0,
  }

  state: State = {
    playback: {
      position: this.props.at,
      pausedAt: 0,
    },
  }

  static getDerivedStateFromProps(
    { at: startTime, context, destination, play }: Props,
    { active, source, buffer, playback }: State,
  ) {
    if (play == active || buffer == null) {
      return null
    }

    // on pause
    if (source) {
      const { pausedAt, position } = playback

      playback = {
        pausedAt: context.currentTime,
        position: (position || startTime) + (context.currentTime - (pausedAt || context.currentTime)),
      }
      source.stop()
      source.disconnect(destination)
      source = null
    }

    // on play
    if (play && source == null) {
      source = context.createBufferSource()
      console.log(source)
      source.buffer = buffer
      source.connect(destination)
      source.start(0, playback.position)
    }

    return {
      active: play,
      playback,
      source,
    }
  }

  async componentDidMount() {
    const { src, context } = this.props
    const { buffer } = this.state

    if (buffer == null) {
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      this.setState({
        buffer: await new Promise<AudioBuffer>((resolve, reject) =>
          context.decodeAudioData(arrayBuffer, resolve, reject),
        ),
      })
    }
  }

  componentWillUnmount() {
    const { destination } = this.props
    const { source } = this.state
    if (source) {
      source.stop()
      source.disconnect(destination)
    }
  }

  render(): null {
    return null
  }
}

export default MediaPlayer
export { MediaPlayer }
