import {
  connectionStatus$ as hConnectionStatus$,
  ConnectionStatus as HConnectionStatus,
  connectToGateway,
} from "@adaptive/hydra-platform"
import { bind } from "@react-rxjs/core"
import {
  combineLatest,
  fromEvent,
  merge,
  noop,
  Observable,
  of,
  Subject,
} from "rxjs"
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  scan,
  startWith,
  withLatestFrom,
} from "rxjs/operators"

type Disposable = () => void

const connectionDisposable$ = new Subject<Disposable>()

// Connect to Hydra gateway and store the disposable
export const initConnection = async () => {
  const dispose = await connectToGateway({
    url: `${window.location.origin}/ws`,
    interceptor: noop,
    autoReconnect: true,
  })

  connectionDisposable$.next(dispose)
}

export enum ConnectionStatus {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  IDLE_DISCONNECTED = "IDLE_DISCONNECTED",
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

// Stream of mapped (Hydra - RT) connection status
const mappedConnectionStatus$ = hConnectionStatus$().pipe(map(connectionMapper))

const IDLE_TIMEOUT = 15 * 60000

// Dispose of connection and emit when idle for IDLE_TIMEOUT ms
const idleDisconnect$: Observable<ConnectionStatus> = combineLatest([
  fromEvent(document, "mousemove").pipe(
    // Start immediately in case user loads and never moves mouse
    startWith(undefined),
  ),
  // Run when connectionDisposable emits, in case user reconnects and doesn't move mouse after
  connectionDisposable$,
]).pipe(
  withLatestFrom(mappedConnectionStatus$),
  filter(
    ([[_, dispose], status]) =>
      // Only when we are connecting/ed and there is a disposable
      [ConnectionStatus.CONNECTING, ConnectionStatus.CONNECTED].includes(
        status,
      ) && !!dispose,
  ),
  debounceTime(IDLE_TIMEOUT),
  map(([[_, dispose]]) => {
    console.log(`User was idle for ${IDLE_TIMEOUT}, disconnecting`)
    dispose!()
    connectionDisposable$.next(undefined)
    return ConnectionStatus.IDLE_DISCONNECTED
  }),
)

export const [useConnectionStatus, connectionStatus$] = bind(
  import.meta.env.VITE_MOCKS
    ? of(ConnectionStatus.CONNECTED)
    : merge<ConnectionStatus, ConnectionStatus>(
        mappedConnectionStatus$,
        idleDisconnect$,
      ).pipe(
        scan((acc, value) => {
          // Keep IDLE_DISCONNECTED when gateway immediately follows with DISCONNECTED
          return acc === ConnectionStatus.IDLE_DISCONNECTED &&
            value === ConnectionStatus.DISCONNECTED
            ? ConnectionStatus.IDLE_DISCONNECTED
            : value
        }, ConnectionStatus.CONNECTING),
      ),
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
