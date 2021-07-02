import {
  connectionStatus$ as hConnectionStatus$,
  ConnectionStatus as HConnectionStatus,
} from "@adaptive/hydra-platform"
import { bind } from "@react-rxjs/core"
import { combineLatest, Observable } from "rxjs"
import { distinctUntilChanged, filter, map, startWith } from "rxjs/operators"

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

export const withIsStaleData = <T>(
  source$: Observable<T>,
): Observable<boolean> => {
  const sourceDate$ = source$.pipe(
    map(() => Date.now()),
    startWith(0),
  )

  const connectionDate$ = connectionStatus$.pipe(
    filter((status) => status === ConnectionStatus.CONNECTED),
    map(() => Date.now()),
  )

  return combineLatest([sourceDate$, connectionDate$]).pipe(
    map(([sourceDate, connectionDate]) => sourceDate < connectionDate),
    distinctUntilChanged(),
  )
}
