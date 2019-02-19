import ReferenceDataService from './referenceDataService'
import { MockScheduler } from 'rt-testing'
import { ServiceClient } from 'rt-system'
import { Observable } from 'rxjs'
import { RawCurrencyPairUpdates } from './referenceDataMapper'
import { MockCurrencyRaw } from './__mocks__'

const currencyRaw = MockCurrencyRaw({})
const input = {
  Updates: [
    {
      UpdateType: 'Removed',
      IsStateOfTheWorld: true,
      IsStale: true,
      CurrencyPair: currencyRaw,
    },
  ],
}

const input2 = {
  Updates: [
    {
      UpdateType: 'Added',
      IsStateOfTheWorld: true,
      IsStale: true,
      CurrencyPair: currencyRaw,
    },
  ],
}
const currencyMap = {
  USDYAN: {
    base: 'USD',
    pipsPosition: 4.6,
    ratePrecision: 2,
    symbol: 'USDYAN',
    terms: 'YAN',
  },
}

describe('ReferenceDataService', () => {
  it('On initialization should correctly call createStreamOperation with reference, getCurrencyPairUpdatesStream and {}', () => {
    const testScheduler = new MockScheduler()
    const actionReference = { a: { update: [] as any } }

    testScheduler.run(({ cold, flush }) => {
      const actionLifetime = '--a--'
      const createStreamOperation = jest.fn<any>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>(actionLifetime, actionReference),
      )

      const serviceClient = new MockServiceClient(createStreamOperation)
      new ReferenceDataService(serviceClient)
      flush()
      expect(createStreamOperation).toHaveBeenCalledTimes(1)
      expect(createStreamOperation).toHaveBeenCalledWith('reference', 'getCurrencyPairUpdatesStream', {})
    })
  })

  it('referenceDataStream should correctly map rawCurrencyPairUpdates to CurrencyPairMap', () => {
    const testScheduler = new MockScheduler()
    testScheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = '--a--'
      const expectLifetime = '--a--'
      const createStreamOperation$ = jest.fn<Observable<RawCurrencyPairUpdates>>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>(actionLifetime, {
          a: input2,
        }),
      )
      const serviceClient = new MockServiceClient(createStreamOperation$)
      const referenceData$ = new ReferenceDataService(serviceClient).getCurrencyPairUpdates$()
      expectObservable(referenceData$).toBe(expectLifetime, { a: currencyMap })
    })
  })

  it('should remove currencyPairUpdate with updateType Remove', () => {
    const testScheduler = new MockScheduler()
    testScheduler.run(({ cold, expectObservable }) => {
      const createStreamOperation$ = jest.fn<Observable<RawCurrencyPairUpdates>>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>('--a--', {
          a: input,
        }),
      )
      const serviceClient = new MockServiceClient(createStreamOperation$)
      const referenceData$ = new ReferenceDataService(serviceClient).getCurrencyPairUpdates$()
      expectObservable(referenceData$).toBe('--a--', { a: {} })
      expect(createStreamOperation$).toHaveBeenCalledTimes(1)
    })
  })
})

type CallBack = (service: string, operationName: string, request: any) => Observable<any>

const MockServiceClient = jest.fn<ServiceClient>((cb: CallBack) => ({
  createStreamOperation: (s: string, o: string, r: any) => cb(s, o, r),
}))
