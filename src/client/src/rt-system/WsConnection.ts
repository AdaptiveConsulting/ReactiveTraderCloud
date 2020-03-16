import { RxStomp, RxStompRPC } from '@stomp/rx-stomp'
import StompConfig from './StompConfig'

export interface WsConnection {
  config: StompConfig
  rpcEndpoint: RxStompRPC
  streamEndpoint: RxStomp

  open(): boolean

  close(): void

  onopen(callback: () => void): void

  onclose(callback: () => void): void
}
