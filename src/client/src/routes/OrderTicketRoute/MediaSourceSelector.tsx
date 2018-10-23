import _ from 'lodash'
import React, { Component } from 'react'

import { MediaPlayer } from './MediaPlayer'
import { UserMedia, UserMediaState } from './UserMedia'

export type Source = 'microphone' | 'sample'

interface Props {
  audioContext: AudioContext
  ready?: boolean
  source?: Source
  forward: AudioDestinationNode[]
  onPermission?: (event: UserMediaState) => any
}

interface State {
  source?: Source
  destination?: AudioDestinationNode | ChannelMergerNode
  userMediaStream?: MediaStream
  userMediaStreamSource?: MediaStreamAudioSourceNode
}

const USE_FIRST = false
// USE_FIRST = true

class MediaSourceSelector extends Component<Props, State> {
  static defaultProps = {
    ready: false,
    source: 'microphone',
    forward: [] as any,
  }

  state: State = {}

  static getDerivedStateFromProps({ audioContext, source, forward, ...props }: Props, state: State) {
    let next: any = {}
    let { connections, destination, userMediaStream, userMediaStreamSource }: any = state

    if (USE_FIRST) {
      if (destination == null) {
        destination = audioContext.createChannelMerger()

        // forward signal to media stream and provide stream as property of channel
        connections = forward.map(target => destination.connect(target))

        next = {
          ...next,
          destination,
          connections,
        }
      }

      // connect the mic 🎤
      if (userMediaStream && userMediaStreamSource == null) {
        userMediaStreamSource = audioContext.createMediaStreamSource(userMediaStream)

        next = {
          ...next,
          destination,
          userMediaStreamSource,
        }
      }
      // on switch source
      if (source !== state.source) {
        const map = {
          sample: [destination, audioContext.destination],
          microphone: [userMediaStreamSource, destination],
        }

        const { connect: connected } = _.mapValues<any, any>(
          { disconnect: map[state.source], connect: map[source] },
          ([from, to] = [], method) => {
            try {
              return from && to && from[method](to)
            } catch (e) {}
          },
        )
        console.log(connected, source, next.source)
        // next.source = connected ? source : null

        next = {
          ...next,
          source,
        }
      }
    } else {
      if (destination == null) {
        destination = audioContext.createChannelMerger()

        // forward signal to media stream and provide stream as property of channel
        connections = forward.map(target => destination.connect(target))

        destination.connect(audioContext.destination)

        next = {
          ...next,
          destination,
          connections,
        }
      }

      // connect the mic 🎤
      if (userMediaStream && userMediaStreamSource == null) {
        userMediaStreamSource = audioContext.createMediaStreamSource(userMediaStream)

        userMediaStreamSource.connect(destination)

        next = {
          ...next,
          destination,
          userMediaStreamSource,
        }
      }

      if (source !== state.source && destination && userMediaStreamSource) {
        switch (source) {
          case 'microphone': {
            destination.disconnect(audioContext.destination)
            userMediaStreamSource.connect(destination)
            break
          }
          case 'sample': {
            userMediaStreamSource.disconnect(destination)
            destination.connect(audioContext.destination)
          }
        }

        next = {
          ...next,
          source,
        }
      }
    }

    return next
  }

  onPermission = (event: UserMediaState) => {
    this.setState({
      userMediaStream: event.mediaStream,
    })

    if (this.props.onPermission) {
      this.props.onPermission(event)
    }
  }

  render() {
    const { audioContext, source, ready } = this.props
    const { destination } = this.state

    return (
      <React.Fragment>
        <UserMedia.Provider
          audio={
            // source === 'microphone'
            // assume audio for simpler control flow
            true
          }
          onPermission={this.onPermission}
        />

        <MediaPlayer
          loop
          at={63}
          rate={1.15}
          play={source === 'sample' && ready ? true : false}
          src="/test.ogg"
          context={audioContext}
          destination={destination}
        />
      </React.Fragment>
    )
  }
}

export default MediaSourceSelector
export { MediaSourceSelector }
