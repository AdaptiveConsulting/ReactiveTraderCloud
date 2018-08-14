import { Connection } from 'autobahn'
import AutobahnSessionProxy from './AutobahnSessionProxy'

export interface AutobahnConnection {
  session?: AutobahnSessionProxy

  open(): boolean

  close(): void

  getConnection(): Connection

  onopen(callback: (session: AutobahnSessionProxy) => void): void

  onclose(callback: (reason: string, details: { reason: string; message: string }) => void): void
}
