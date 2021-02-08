import { Observable } from "rxjs"

const mockModule = () => {
  const { NEVER, defer } = require("rxjs")
  const { equals } = require("./equals")

  let registeredStreams: Array<[Array<any>, Observable<any>]> = []

  const getMatch = (type: string, args: any[]) => {
    const result =
      registeredStreams.find(
        ([[_type, ..._args]]) => _type === type && equals(_args, args),
      )?.[1] ?? NEVER
    return result
  }

  const toJestMock = (fn: any) => {
    const mockFn = jest.fn()
    const enhancedFn = ((...args: any[]) => {
      ;(mockFn as any)(...args)
      return fn(...args)
    }).bind(mockFn)
    const proxy = new Proxy(enhancedFn, {
      get: function (_, prop) {
        return (mockFn as any)[prop]
      },
    })
    return proxy as jest.Mock<any, any>
  }

  return {
    whenWatch: (topic: string, stream: Observable<any>) => {
      registeredStreams.push([["watch", topic], stream])
    },
    whenStream: (
      service: string,
      operationName: string,
      payload: any,
      stream: Observable<any>,
    ) => {
      registeredStreams.push([
        ["stream", service, operationName, payload],
        stream,
      ])
    },
    whenRpc: (
      service: string,
      operationName: string,
      payload: any,
      stream: Observable<any>,
    ) => {
      registeredStreams.push([["rpc", service, operationName, payload], stream])
    },
    watch$: toJestMock((...args: any[]) =>
      defer(() => getMatch("watch", args)),
    ),
    getRemoteProcedureCall$: toJestMock((...args: any[]) =>
      defer(() => getMatch("rpc", args)),
    ),
    getStream$: toJestMock((...args: any[]) =>
      defer(() => getMatch("stream", args)),
    ),
    reset: () => {
      registeredStreams = []
    },
  }
}

type MockedClient = ReturnType<typeof mockModule>

jest.mock("services/client", () => mockModule())

const mock = require("services/client") as MockedClient

export const {
  watch$,
  getRemoteProcedureCall$,
  getStream$,
  whenStream,
  whenRpc,
  whenWatch,
  reset,
} = mock
