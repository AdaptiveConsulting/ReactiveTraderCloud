import ReferenceDataService from './referenceDataService'
import { MockScheduler } from 'rt-testing'
import { ServiceClient } from 'rt-system'
import { Observable } from 'rxjs'
import { RawCurrencyPairUpdates, CurrencyRaw } from './referenceDataMapper'

const initcurrencyRaw = {
  Symbol: 'USDYAN',
  RatePrecision: 2.0,
  PipsPosition: 4.6,
}

const MockCurrencyRaw = (overrides: Partial<CurrencyRaw>) => ({
  ...initcurrencyRaw,
  ...overrides,
})

const currencyRaw = MockCurrencyRaw({})
const rawCurrenpairRemoved = {
  Updates: [
    {
      UpdateType: 'Removed',
      IsStateOfTheWorld: true,
      IsStale: true,
      CurrencyPair: currencyRaw,
    },
  ],
}

const rawCurrencyPairAdded = {
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
  it('should, on initialization call createStreamOperation', () => {
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

  it('should correctly map rawCurrencyPairUpdates to CurrencyPairMap', () => {
    const testScheduler = new MockScheduler()

    const actionReference = {
      a: rawCurrencyPairAdded,
    }
    const expectReference = { a: currencyMap }

    testScheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = '--a--'
      const expectLifetime = '--a--'
      const createStreamOperation$ = jest.fn<Observable<RawCurrencyPairUpdates>>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>(actionLifetime, actionReference),
      )
      const serviceClient = new MockServiceClient(createStreamOperation$)
      const referenceData$ = new ReferenceDataService(serviceClient).getCurrencyPairUpdates$()
      expectObservable(referenceData$).toBe(expectLifetime, expectReference)
    })
  })

  it('should remove currencyPair with updateType of Remove', () => {
    const testScheduler = new MockScheduler()
    const actionReference = {
      a: rawCurrenpairRemoved,
    }
    const expectReference = { a: {} }
    testScheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = '--a--'
      const expectLifetime = '--a--'
      const createStreamOperation$ = jest.fn<Observable<RawCurrencyPairUpdates>>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>(actionLifetime, actionReference),
      )
      const serviceClient = new MockServiceClient(createStreamOperation$)
      const referenceData$ = new ReferenceDataService(serviceClient).getCurrencyPairUpdates$()
      expectObservable(referenceData$).toBe(expectLifetime, expectReference)
      expect(createStreamOperation$).toHaveBeenCalledTimes(1)
    })
  })
})

type CallBack = (service: string, operationName: string, request: any) => Observable<any>

const MockServiceClient = jest.fn<ServiceClient>((cb: CallBack) => ({
  createStreamOperation: (s: string, o: string, r: any) => cb(s, o, r),
}))
