import { Connection } from 'autobahn'
import AutobahnSessionProxy from './AutobahnSessionProxy'
import { DisconnectionReason } from './DisconnectionReason'

export interface AutobahnConnection {
  session?: AutobahnSessionProxy

  open(): boolean

  close(): void

  getConnection(): Connection

  onopen(callback: (session: AutobahnSessionProxy) => void): void

  onclose(
    callback: (reason: DisconnectionReason, details: { reason: string; message: string }, willRetry: boolean) => void,
  ): void
}
