import { Connection } from 'autobahn'
import AutobahnSessionProxy from './AutobahnSessionProxy'
import { DisconnectionReason } from './DisconnectionReason'
import {RxStomp, RxStompRPC} from '@stomp/rx-stomp'

export interface AutobahnConnection {
  rpcEndpoint: RxStompRPC
  streamEndpoint: RxStomp
  
  session?: AutobahnSessionProxy

  open(): boolean

  close(): void

  getConnection(): Connection

  onopen(callback: (session: AutobahnSessionProxy) => void): void

  onclose(
    callback: (reason: DisconnectionReason, details: { reason: string; message: string }, willRetry: boolean) => void,
  ): void
}
