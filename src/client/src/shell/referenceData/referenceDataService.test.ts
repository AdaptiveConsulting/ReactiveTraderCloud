import ReferenceDataService from './referenceDataService'
import { MockScheduler } from 'rt-testing'
import { ServiceClient } from 'rt-system'
import { Observable } from 'rxjs'
import {
  default as referenceDataMapper,
  RawCurrencyPairUpdates,
  CurrencyRaw,
  RawCurrencyPairUpdate,
} from './referenceDataMapper'

describe('ReferenceDataService', () => {
  it('On initialization should correctly call createStreamOperation with reference, getCurrencyPairUpdatesStream and {}', () => {
    const testScheduler = new MockScheduler()
    testScheduler.run(({ cold, flush }) => {
      const callBack = jest.fn<any>((s: string, o: string, r: any) =>
        cold<RawCurrencyPairUpdates>('--a--', { a: { update: [] } }),
      )
      const serviceClient = new MockServiceClient(callBack)
      const referenceDataService = new ReferenceDataService(serviceClient)
      flush()
      expect(callBack).toHaveBeenCalledTimes(1)
      expect(callBack).toHaveBeenCalledWith('reference', 'getCurrencyPairUpdatesStream', {})
    })
  })

  it('getCurrencyPairUpdates$ should return observable of ', () => {})

  it('referenceDataStream should correctly map rawCurrencyPairUpdates to CurrencyPairMap', () => {})

  it('should remove currencyPairUpdate with updateType Remove', () => {})
})

type CallBack = (service: string, operationName: string, request: any) => Observable<any>

const MockServiceClient = jest.fn<ServiceClient>((cb: CallBack) => ({
  createStreamOperation: (s: string, o: string, r: any) => cb(s, o, r),
}))
