import { unstable_batchedUpdates } from "react-dom"
import { Observable } from "rxjs"
import { map, switchMap, take } from "rxjs/operators"
import { endpoints$ } from "./endpoints"

const code = "LMO"

const batchUpdates =
  <T>() =>
  (source$: Observable<T>): Observable<T> =>
    new Observable<T>((observer) =>
      source$.subscribe(
        (v) => {
          unstable_batchedUpdates(() => {
            observer.next(v)
          })
        },
        observer.error.bind(observer),
        observer.complete.bind(observer),
      ),
    )

export const watch$ = <TResponse>(topic: string): Observable<TResponse> =>
  endpoints$.pipe(
    switchMap(({ streamEndpoint }) =>
      streamEndpoint.watch(`/exchange/${topic}`),
    ),
    map((message) => JSON.parse(message.body)),
    batchUpdates(),
  )

export const getRemoteProcedureCall$ = <TResponse, TPayload>(
  service: string,
  operationName: string,
  payload: TPayload,
): Observable<TResponse> =>
  endpoints$.pipe(
    switchMap(({ rpcEndpoint }) =>
      rpcEndpoint.rpc({
        destination: `/amq/queue/${service}.${operationName}`,
        body: JSON.stringify({ payload, Username: code }),
      }),
    ),
    map((message) => JSON.parse(message.body)),
    take(1),
    batchUpdates(),
  )

export const getStream$ = <TResponse, TPayload = {}>(
  service: string,
  operationName: string,
  payload: TPayload,
): Observable<TResponse> =>
  endpoints$.pipe(
    switchMap(({ rpcEndpoint }) =>
      rpcEndpoint.stream({
        destination: `/amq/queue/${service}.${operationName}`,
        body: JSON.stringify({ payload, Username: code }),
      }),
    ),
    map((message) => JSON.parse(message.body)),
    batchUpdates(),
  )
