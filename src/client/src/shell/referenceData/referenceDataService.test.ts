import ReferenceDataService from './referenceDataService'
import { MockScheduler } from 'rt-testing'
import { ServiceClient } from 'rt-system'
import { Observable } from 'rxjs'
import { RawCurrencyPairUpdates } from './referenceDataMapper'
import { MockCurrencyRaw } from './__mocks__'

describe('ReferenceDataService', () => {
  it('On initialization should correctly call createStreamOperation with reference, getCurrencyPairUpdatesStream and {}', () => {
    const testScheduler = new MockScheduler()
    testScheduler.run(({ cold, flush }) => {
      const createStreamOperation = jest.fn<any>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>('--a--', { a: { update: [] } }),
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
    const currencyRaw = MockCurrencyRaw({})
    const Updates = {
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
    testScheduler.run(({ cold, expectObservable }) => {
      const createStreamOperation = jest.fn<Observable<RawCurrencyPairUpdates>>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>('--a--', {
          a: Updates,
        }),
      )
      const serviceClient = new MockServiceClient(createStreamOperation)
      const referenceData$ = new ReferenceDataService(serviceClient).getCurrencyPairUpdates$()
      expectObservable(referenceData$).toBe('--a--', { a: currencyMap })
    })
  })

  it('should remove currencyPairUpdate with updateType Remove', () => {
    const testScheduler = new MockScheduler()
    const currencyRaw = MockCurrencyRaw({})
    const Updates = {
      Updates: [
        {
          UpdateType: 'Removed',
          IsStateOfTheWorld: true,
          IsStale: true,
          CurrencyPair: currencyRaw,
        },
      ],
    }

    testScheduler.run(({ cold, expectObservable }) => {
      const createStreamOperation = jest.fn<Observable<RawCurrencyPairUpdates>>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>('--a--', {
          a: Updates,
        }),
      )
      const serviceClient = new MockServiceClient(createStreamOperation)
      const referenceData$ = new ReferenceDataService(serviceClient).getCurrencyPairUpdates$()
      expectObservable(referenceData$).toBe('--a--', { a: {} })
    })
  })
})

type CallBack = (service: string, operationName: string, request: any) => Observable<any>

const MockServiceClient = jest.fn<ServiceClient>((cb: CallBack) => ({
  createStreamOperation: (s: string, o: string, r: any) => cb(s, o, r),
}))
