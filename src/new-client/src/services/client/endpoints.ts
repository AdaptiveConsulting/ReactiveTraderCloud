import { RxStompRPC, RxStomp } from "@stomp/rx-stomp"
import { Observable } from "rxjs"
import { shareReplay } from "rxjs/operators"

export const endpoints$ = new Observable<{
  rpcEndpoint: RxStompRPC
  streamEndpoint: RxStomp
}>((observer) => {
  const url = process.env.REACT_APP_BROKER_HOST || globalThis.location.hostname
  const port = +(process.env.REACT_APP_BROKER_PORT || globalThis.location.port)
  const useSecure = globalThis.location.protocol === "https:"
  const securePort = 443
  const defaultPort = port ? port : 80
  const brokerURL = useSecure
    ? `wss://${url}:${securePort}/ws`
    : `ws://${url}:${defaultPort}/ws`
  const reconnectDelay = 500
  const connectionTimeout = 0

  const streamEndpoint = new RxStomp()
  streamEndpoint.configure({
    brokerURL,
    reconnectDelay,
    connectionTimeout,
  })
  const rpcEndpoint = new RxStompRPC(streamEndpoint)
  streamEndpoint.activate()

  observer.next({ streamEndpoint, rpcEndpoint })
  return () => {
    streamEndpoint.deactivate()
  }
}).pipe(shareReplay(1))
