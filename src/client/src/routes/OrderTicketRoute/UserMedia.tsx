import React from 'react'

const Context = React.createContext<UserMediaState | null>(null)

export interface UserMediaState {
  ok?: boolean
  error?: Error
  mediaStream: MediaStream | null
}

export interface UserMediaProps {
  audio?: boolean
}

class UserMediaProvider extends React.Component<UserMediaProps, UserMediaState> {
  state = {
    mediaStream: null,
  } as any

  mounted: boolean
  async componentDidMount() {
    this.mounted = true
    // Await permission! 🐉
    while (this.mounted) {
      let mediaStream
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

        if (this.state.mediaStream == null) {
          this.setState({ ok: true, mediaStream, error: null })
        }
      } catch (error) {
        if (this.state.error == null) {
          this.setState({ mediaStream: null, error })
        }
      }

      // Poll for changes to permission
      await new Promise(next => setTimeout(next, 200))
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
