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
  mapTo,
  scan,
  startWith,
  withLatestFrom,
} from "rxjs/operators"

type Disposable = () => void

const connectionDisposable$ = new Subject<Disposable>()

export enum ConnectionStatus {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  IDLE_DISCONNECTED = "IDLE_DISCONNECTED",
  OFFLINE_DISCONNECTED = "OFFLINE_DISCONNECTED",
}

const connectionExists = (status: ConnectionStatus, dispose: Disposable) => {
  return (
    [ConnectionStatus.CONNECTING, ConnectionStatus.CONNECTED].includes(
      status,
    ) && !!dispose
  )
}

// Connect to Hydra gateway and store the disposable
export const initConnection = async () => {
  const dispose = await connectToGateway({
    url: `${window.location.origin}/ws`,
    interceptor: noop,
    autoReconnect: true,
  })
  connectionDisposable$.next(dispose)
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
  filter(([[_, dispose], status]) =>
    // Only when we are connecting/ed and there is a disposable
    connectionExists(status, dispose),
  ),
  debounceTime(IDLE_TIMEOUT),
  map(([[_, dispose]]) => {
    console.log(`User was idle for ${IDLE_TIMEOUT}, disconnecting`)
    dispose!()
    connectionDisposable$.next(undefined)
    return ConnectionStatus.IDLE_DISCONNECTED
  }),
)

/**
 * Observable that fires when user's network connection status changes
 * "true" for user is connected to the network, "false" for not connected to the network
 * Note - Network connection does not guarantee internet connection
 * The user's network might lose connection to the internet even though the device is connected to the network
 * In this scenario $online will not fire that the user went offline (false positive for internet connection status)
 */
const online$: Observable<Boolean> = merge(
  of(navigator.onLine),
  fromEvent(window, "online").pipe(mapTo(true)),
  fromEvent(window, "offline").pipe(mapTo(false)),
)

// Update connection status when use goes offline
const offlineDisconnect$: Observable<ConnectionStatus> = online$.pipe(
  withLatestFrom(connectionDisposable$, mappedConnectionStatus$),
  filter(
    ([online, dispose, status]) => !online && connectionExists(status, dispose),
  ),
  map(() => {
    console.log(`User went offline, setting status to disconnecting`)
    return ConnectionStatus.OFFLINE_DISCONNECTED
  }),
)

// Init connection when user goes online
const onlineConnect$: Observable<ConnectionStatus> = online$.pipe(
  withLatestFrom(mappedConnectionStatus$),
  filter(([online, status]) => !!online),
  map(([online, status]) => {
    console.log(
      `User came online, updated with latest mapped connection status`,
    )
    return status
  }),
)

export const [useConnectionStatus, connectionStatus$] = bind(
  import.meta.env.VITE_MOCKS
    ? of(ConnectionStatus.CONNECTED)
    : merge<
        ConnectionStatus,
        ConnectionStatus,
        ConnectionStatus,
        ConnectionStatus
      >(
        mappedConnectionStatus$,
        idleDisconnect$,
        offlineDisconnect$,
        onlineConnect$,
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
