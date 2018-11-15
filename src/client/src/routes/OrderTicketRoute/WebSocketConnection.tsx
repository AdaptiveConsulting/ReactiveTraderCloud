import _ from 'lodash'
import { PureComponent } from 'react'

export interface WebSocketEventHandlers {
  onclose: (ev: CloseEvent) => void
  onerror: (ev: Event) => void
  onmessage: (ev: MessageEvent) => void
  onopen: (ev: Event) => void
}

export interface Props {
  create: (config: WebSocketEventHandlers) => WebSocket
  onOpen?: (socket: WebSocket) => void
  onError?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  onClose?: (event: CloseEvent) => void
}

class WebSocketConnection extends PureComponent<Props> {
  socket: WebSocket

  componentDidMount() {
    this.socket = this.props.create({
      onopen: this.onOpen,
      onerror: this.onError,
      onmessage: this.onMessage,
      onclose: this.onClose,
    })
  }

  closing: boolean
  umounting: boolean
  componentWillUnmount() {
    this.umounting = true
    if (!this.closing) {
      this.socket.close()
      this.props.onClose(null)
    }
  }

  onOpen = (event: Event) => {
    if (!this.umounting && this.props.onOpen) {
      this.props.onOpen(this.socket)
    }
  }

  onError = (event: Event) => {
    if (!this.umounting && this.props.onError) {
      this.props.onError(event)
    }
  }

  onMessage = (event: MessageEvent) => {
    if (!this.umounting && this.props.onMessage) {
      this.props.onMessage(event)
    }
  }

  onClose = (event: CloseEvent) => {
    if (!this.umounting && this.props.onClose) {
      this.props.onClose(event)
    }
  }

  render(): null {
    return null
  }
}

export default WebSocketConnection
export { WebSocketConnection }
