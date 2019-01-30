import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { TestScheduler } from 'rxjs/testing'
import { ActionsObservable } from 'redux-observable'
import { ConnectionActions } from 'rt-actions'
import { ServiceStubWithLoadBalancer } from 'rt-system'
import { RawTradeUpdate, Direction } from 'rt-types'
import { Action, ActionWithPayload } from 'rt-util'
import { ApplicationDependencies } from 'applicationServices'
import { blotterServiceEpic } from './epics'
import { BlotterActions } from '../actions'
import { TradesUpdate } from '../blotterService'

const createScheduler = (assertDeepEqual?: (actual: any, expected: any) => boolean | void) =>
  new TestScheduler(assertDeepEqual || ((actual, expected) => expect(actual).toEqual(expected)))

describe('blotterServiceEpic', () => {
  it("returns an observable that contains no actions when the component hasn't mounted", () => {
    const scheduler = createScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct = '--0--'
      const tradeStream = '--a--b--c'
      const oooexpected = ''
      const mapToExpect: any = ({ payload: { trades } }: ActionWithPayload<any, TradesUpdate>) =>
        trades[0].dealtCurrency

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = createStandardServiceStub(cold, tradeStream, toRawTradeUpdate)
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockSubscriptionAction$(cold(lifetimeAct))

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(epic.pipe(map(mapToExpect))).toBe(oooexpected)
    })
  })

  it('returns an observable that contains new trade actions for incoming trades', () => {
    const scheduler = createScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct1 = BlotterActions.subscribeToBlotterAction
      const lifetimeAct = '--0--1|'
      const tradeStream = '     --a--b----c'
      const oooexpected = '-------a--b----c'
      const mapToExpect: any = ({ payload: { trades } }: ActionWithPayload<any, TradesUpdate>) =>
        trades[0].dealtCurrency

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = createStandardServiceStub(cold, tradeStream, toRawTradeUpdate)
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockSubscriptionAction$(cold(lifetimeAct), lifetimeAct1)

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(epic.pipe(map(mapToExpect))).toBe(oooexpected)
    })
  })

  it('returns an observable that stops generating trade actions when the application disconnects', () => {
    const scheduler = createScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct1 = BlotterActions.subscribeToBlotterAction
      const lifetimeAct = '--0--1-------2'
      const tradeStream = '     --a--b----c----d---e'
      const oooexpected = '-------a--b----c--'
      const mapToExpect: any = ({ payload: { trades } }: ActionWithPayload<any, TradesUpdate>) =>
        trades[0].dealtCurrency

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = createStandardServiceStub(cold, tradeStream, toRawTradeUpdate)
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockSubscriptionAction$(cold(lifetimeAct), lifetimeAct1)

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(epic.pipe(map(mapToExpect))).toBe(oooexpected)
    })
  })
})

const MockServiceStubWithLoadBalancer = jest.fn<ServiceStubWithLoadBalancer>(
  (getResponses: (service: string, operationName: string, request: any) => Observable<any>) => ({
    createStreamOperation: jest
      .fn((s: string, o: string, r: any) => getResponses(s, o, r))
      .mockName('createStreamOperation'),
  }),
)

const MockApplicationDependencies = jest.fn<ApplicationDependencies>(
  (loadBalancedServiceStub?, referenceDataService?, platform?, limitChecker?, serviceStatus$?, connection$?) => ({
    referenceDataService,
    platform,
    limitChecker,
    loadBalancedServiceStub,
    serviceStatus$,
    connection$,
  }),
)

function createStandardServiceStub<TResult>(
  cold: (marbles: string) => Observable<{}>,
  serviceStream: string,
  selector: (name: string | number | {}) => TResult,
): ServiceStubWithLoadBalancer {
  return new MockServiceStubWithLoadBalancer(() => cold(serviceStream).pipe(map(selector)))
}

function mockSubscriptionAction$(
  action$: Observable<number>,
  ...actionFunctions: Array<() => Action<any>>
): Observable<Action<any>> {
  return mockServiceLifetimeAction$(
    action$,
    ...[ConnectionActions.connect, ...actionFunctions, ConnectionActions.disconnect],
  )
}

function mockServiceLifetimeAction$(
  action$: Observable<number>,
  ...actionFunctions: Array<() => Action<any>>
): Observable<Action<any>> {
  return action$.pipe(map(number => actionFunctions[number]()))
}

function toRawTradeUpdate(name: string | number | {}): RawTradeUpdate {
  const snapshot = typeof name === 'string' ? name.toLowerCase() === 'a' : name === 0
  return {
    IsStateOfTheWorld: snapshot,
    IsStale: false,
    Trades: snapshot
      ? Array.from(Array(10).keys()).map(i => ({
          TradeId: i,
          CurrencyPair: 'USD/EUP',
          TraderName: 'bob',
          Notional: i * 100,
          DealtCurrency: i === 0 ? name.toString() : 'SNAPSHOT:' + i,
          Direction: Direction.Buy,
          Status: 'PENDING',
          SpotRate: i * 100,
          TradeDate: new Date().toString(),
          ValueDate: new Date().toString(),
        }))
      : [
          {
            TradeId: Math.floor(Math.random() * 9),
            CurrencyPair: 'USD/EUP',
            TraderName: 'bob',
            Notional: Math.random() * 100,
            DealtCurrency: name.toString(),
            Direction: Direction.Buy,
            Status: 'PENDING',
            SpotRate: Math.random() * 100,
            TradeDate: new Date().toString(),
            ValueDate: new Date().toString(),
          },
        ],
  }
}
