import { Connection, Session } from 'autobahn'
import AutobahnSessionProxy from './autobahnSessionProxy'

export interface AutobahnConnection {
  session?: AutobahnSessionProxy

  open(): boolean

  close(): void

  getConnection(): Connection

  onopen(callback: (session: Session) => void): void

  onclose(
    callback: (
      reason: string,
      details: { reason: string; message: string }
    ) => void
  ): void
}
