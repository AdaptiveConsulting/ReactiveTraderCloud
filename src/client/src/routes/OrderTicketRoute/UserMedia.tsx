import { isEqual } from 'lodash'
import React from 'react'

const Context = React.createContext<UserMediaState | null>(null)

export interface UserMediaState {
  constraints: MediaStreamConstraints | null
  mediaStream: MediaStream | null
  error?: Error
  ok?: boolean
}

export interface UserMediaProps extends MediaStreamConstraints {
  onPermission?: (event: UserMediaState) => any
}

class UserMediaProvider extends React.Component<UserMediaProps, UserMediaState> {
  state = {
    constraints: null,
    mediaStream: null,
  } as any

  mounted: boolean = true
  async componentDidMount() {
    // Await permission! 🐉
    while (this.mounted) {
      const { audio, video, peerIdentity } = this.props
      const constraints = { audio, video, peerIdentity }

      // on user media request
      if (!this.state.mediaStream || !isEqual(constraints, this.state.constraints)) {
        let mediaStream = null
        let error = null
        let nextState

        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        } catch (caughtError) {
          error = caughtError
        }

        nextState = {
          constraints,
          mediaStream,
          error,
          ok: error == null && mediaStream != null,
        }

        if (this.mounted && nextState.ok !== this.state.ok) {
          this.setState(nextState)

          if (this.props.onPermission) {
            this.props.onPermission(nextState)
          }
        }
      }
      // on user media end
      // else if (this.state.mediaStream && !(audio || video)) {
      //   this.state.mediaStream.stop()
      // }

      // Poll for changes to permission
      await new Promise(next => setTimeout(next, 500))
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    return <Context.Provider value={this.state}>{this.props.children}</Context.Provider>
  }
}

export const UserMedia = {
  Provider: UserMediaProvider,
  Consumer: Context.Consumer,
}

export default UserMedia
