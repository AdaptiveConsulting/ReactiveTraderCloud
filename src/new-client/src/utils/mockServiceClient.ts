import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

const defaultMocks = jest.requireActual('../services/client')
let mocks = { ...defaultMocks }

export mockedFns = Object.fromEntries(
  Object.keys(defaultMocks).map(fnName => [
    fnName,
    (...args: any[]) => of(null).pipe(switchMap(() => (mocks as any)[fnName](...args)))
  ]),
)

jest.mock('../services/client', () => mockedFns)

export function mockClient<T extends Partial<typeof defaultMocks>>(mock: T) {
  const result: Record<keyof T, jest.SpyInstance> = Object.fromEntries(
    Object.entries(mock).map(
      ([fnName, implementation]: any) => [fnName, jest.fn().mockImplementation(implementation)] as const,
    ),
  )
  mocks = { ...defaultMocks, ...result }
}