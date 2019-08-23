import { ActionsObservable } from 'redux-observable'
import { blotterServiceEpic } from './epics'
import { BlotterActions } from '../actions'
import { ServiceStubWithLoadBalancer } from 'rt-system'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Direction } from 'rt-types'
import { MockScheduler } from 'rt-testing'
import { ConnectionActions } from 'rt-actions'

const rawTrades = {
  IsStateOfTheWorld: true,
  IsStale: false,
  Trades: [
    {
      TradeId: 0,
      CurrencyPair: 'USD/EUP',
      TraderName: 'bob',
      Notional: 100,
      DealtCurrency: 'USD',
      Direction: Direction.Buy,
      Status: 'PENDING',
      SpotRate: 100,
      TradeDate: new Date().toString(),
      ValueDate: new Date().toString(),
    },
  ],
}
const newTradesType = '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES'

const MockServiceClient = jest.fn<ServiceStubWithLoadBalancer>(
  (getResponses: (service: string, operationName: string, request: any) => Observable<any>) => ({
    createStreamOperation: jest.fn((s: string, o: string, r: any) => getResponses(s, o, r)),
  }),
)

describe('blotterServiceEpic', () => {
  it('should ignore any action before being connected and subscribed to BlotterService', () => {
    const randomAction = 'randomAction'
    const actionLifetime = '-a-b---'
    const expectLifetime = ''

    const scheduler = new MockScheduler()
    scheduler.run(({ cold, expectObservable, flush }) => {
      const actionReference = { a: { type: `${randomAction}1` }, b: { type: `${randomAction}2` } }
      const loadBalancedServiceStub = new MockServiceClient(() => of(rawTrades))
      const action$ = cold(actionLifetime, actionReference)

      const epics$ = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, {
        loadBalancedServiceStub,
      })
      expectObservable(epics$).toBe(expectLifetime)
    })
  })

  it('should map rawTrades to createNewTradesAction', () => {
    const scheduler = new MockScheduler()
    const connectionAction = ConnectionActions.connect()
    const subscribeAction = BlotterActions.subscribeToBlotterAction()

    const actionReference = { c: connectionAction, s: subscribeAction, r: rawTrades }
    const expectReference = { a: true }
    scheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = '--(cs)-r'
      const expectLifetime = '--a--'

      const loadBalancedServiceStub = new MockServiceClient(() => of(rawTrades))
      const action$ = cold(actionLifetime, actionReference)

      const epics$ = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, {
        loadBalancedServiceStub,
      }).pipe(map(r => r.type === newTradesType))

      expectObservable(epics$).toBe(expectLifetime, expectReference)
    })
  })

  it('returns an observable that stops generating trade actions when the application disconnects', () => {
    const scheduler = new MockScheduler()
    const connectionAction = ConnectionActions.connect()
    const subscribeAction = BlotterActions.subscribeToBlotterAction()
    const disconnect = ConnectionActions.disconnect()
    const actionReference = { c: connectionAction, s: subscribeAction, r: rawTrades, d: disconnect }
    const expectReference = { a: true }

    scheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = '--(cs)-r--d-r-r'
      const expectLifetime = '--a------'

      const loadBalancedServiceStub = new MockServiceClient(() => of(rawTrades))
      const action$ = cold(actionLifetime, actionReference)

      const epics$ = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, {
        loadBalancedServiceStub,
      }).pipe(map(r => r.type === newTradesType))

      expectObservable(epics$).toBe(expectLifetime, expectReference)
    })
  })
})
