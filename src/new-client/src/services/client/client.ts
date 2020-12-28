import { combineLatest, Observable } from "rxjs"
import { map, switchMap, take } from "rxjs/operators"
import { currentUser$ } from "../currentUser"
import { endpoints$ } from "./endpoints"

export const watch$ = <TResponse>(topic: string): Observable<TResponse> =>
  endpoints$.pipe(
    switchMap(({ streamEndpoint }) =>
      streamEndpoint.watch(`/exchange/${topic}`),
    ),
    map((message) => JSON.parse(message.body)),
  )

export const getRemoteProcedureCall$ = <TResponse, TPayload>(
  service: string,
  operationName: string,
  payload: TPayload,
): Observable<TResponse> =>
  combineLatest([endpoints$, currentUser$]).pipe(
    switchMap(([{ rpcEndpoint }, { code }]) =>
      rpcEndpoint.rpc({
        destination: `/amq/queue/${service}.${operationName}`,
        body: JSON.stringify({ payload, Username: code }),
      }),
    ),
    map((message) => JSON.parse(message.body)),
    take(1),
  )

export const getStream$ = <TResponse, TPayload = {}>(
  service: string,
  operationName: string,
  payload: TPayload,
): Observable<TResponse> =>
  combineLatest([endpoints$, currentUser$]).pipe(
    switchMap(([{ rpcEndpoint }, { code }]) =>
      rpcEndpoint.stream({
        destination: `/amq/queue/${service}.${operationName}`,
        body: JSON.stringify({ payload, Username: code }),
      }),
    ),
    map((message) => JSON.parse(message.body)),
  )
