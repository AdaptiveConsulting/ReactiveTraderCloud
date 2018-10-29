import * as React from 'react'

export interface Props {
  src?: Blob | string
  at?: number
  play?: boolean
  loop?: boolean
  rate?: number
  context: AudioContext
  output?: AudioNode
  children?: (state: State) => any
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
    rate: 1,
  }

  state: State = {
    playback: {
      position: this.props.at,
      pausedAt: 0,
    },
  }

  static getDerivedStateFromProps(
    { at: startTime, context, output, play, loop, rate }: Props,
    { active, source, buffer, playback }: State,
  ) {
    if (play === active || buffer == null) {
      return null
    }

    // on pause
    if (source) {
      const { pausedAt, position } = playback

      playback = {
        pausedAt: context.currentTime,
        position: loop
          ? startTime
          : (position || startTime) + (context.currentTime - (pausedAt || context.currentTime)),
      }

      if (playback.position > buffer.duration) {
        playback.position = 0
      }

      source.stop()
      output && source.disconnect(output)
      source = null
    }

    // on play
    if (play && source == null) {
      source = context.createBufferSource()
      source.buffer = buffer
      source.playbackRate.value = rate
      output && source.connect(output)
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
      const arrayBuffer: ArrayBuffer = !(src instanceof Blob)
        ? await (await fetch(src, { cache: 'force-cache' })).arrayBuffer()
        : await new Promise<ArrayBuffer>((resolve, reject) =>
            Object.assign(new FileReader(), {
              onloadend() {
                resolve(this.result)
              },
            }).readAsArrayBuffer(src),
          )

      const buffer = await new Promise<AudioBuffer>((resolve, reject) =>
        context.decodeAudioData(arrayBuffer, resolve, reject),
      )

      if (!this.unmounting) {
        this.setState({ buffer })
      }
    }
  }

  unmounting: boolean
  componentWillUnmount() {
    this.unmounting = true

    const { output } = this.props
    const { source } = this.state

    if (source) {
      source.stop()
      output && source.disconnect(output)
    }
  }

  render(): null {
    const { children } = this.props

    return (children && children(this.state)) || null
  }
}

export default MediaPlayer
export { MediaPlayer }
