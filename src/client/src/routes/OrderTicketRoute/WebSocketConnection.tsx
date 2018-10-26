import _ from 'lodash'
import React, { PureComponent } from 'react'

import * as GreenKeyRecognition from './GreenKeyRecognition'

export interface WebSocketEventHandles {
  onopen: any
  onerror: any
  onmessage: any
  onclose: any
}

export interface Props {
  create: (config: WebSocketEventHandles) => WebSocket & any
  onOpen?: (event: any) => any
  onError?: (event: ErrorEvent) => any
  onMessage?: (event: any) => any
  onClose?: (event: any) => any
}

class WebSocketConnection extends React.PureComponent<Props> {
  socket: WebSocket

  componentDidMount() {
    this.socket = this.props.create({
      onopen: this.onOpen,
      onerror: this.onClose,
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

  onOpen = (event: any) => {
    if (!this.umounting && this.props.onOpen) {
      this.props.onOpen({ ...event, target: this.socket })
    }
  }

  onError = (event: ErrorEvent) => {
    if (!this.umounting && this.props.onError) {
      this.props.onError(event)
    }
  }

  onMessage = (event: any) => {
    if (!this.umounting && this.props.onMessage) {
      this.props.onMessage(event)
    }
  }

  onClose = (event: any) => {
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
