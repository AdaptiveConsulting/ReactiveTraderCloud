import {
  connectionStatus$ as hConnectionStatus$,
  ConnectionStatus as HConnectionStatus,
} from "@adaptive/hydra-platform"
import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

export enum ConnectionStatus {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

const mapper: Record<HConnectionStatus, ConnectionStatus> = {
  [HConnectionStatus.DISCONNECTED]: ConnectionStatus.DISCONNECTED,
  [HConnectionStatus.CONNECTED]: ConnectionStatus.CONNECTED,
  [HConnectionStatus.CONNECTING]: ConnectionStatus.CONNECTING,
  [HConnectionStatus.RECONNECTING]: ConnectionStatus.CONNECTING,
  [HConnectionStatus.ERROR]: ConnectionStatus.DISCONNECTED,
}
const connectionMapper = (input: HConnectionStatus): ConnectionStatus =>
  mapper[input]

export const [useConnectionStatus, connectionStatus$] = bind(
  hConnectionStatus$().pipe(map(connectionMapper)),
  ConnectionStatus.CONNECTING,
)
