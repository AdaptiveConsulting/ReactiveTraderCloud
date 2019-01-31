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
      const lifetimeAct = '--C--' // See AppLifetimeEvent
      const tradeStream = '--0--1--2'
      const oooexpected = ''

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = new MockServiceStubWithLoadBalancer(() => fromMarbles(toRawTradeUpdate, cold, tradeStream))
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockLifetimeAction$(cold(lifetimeAct))

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(fromTradeActionsToMarbles(epic)).toBe(oooexpected)
    })
  })

  it('returns an observable that contains new trade actions for incoming trades', () => {
    const scheduler = createScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct1 = BlotterActions.subscribeToBlotterAction
      const lifetimeAct = '--C--1|' // See AppLifetimeEvent
      const tradeStream = '     --0--1----2'
      const oooexpected = '-------0--1----2'

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = new MockServiceStubWithLoadBalancer(() => fromMarbles(toRawTradeUpdate, cold, tradeStream))
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockLifetimeAction$(cold(lifetimeAct), lifetimeAct1)

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(fromTradeActionsToMarbles(epic)).toBe(oooexpected)
    })
  })

  it('returns an observable that stops generating trade actions when the application disconnects', () => {
    const scheduler = createScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct1 = BlotterActions.subscribeToBlotterAction
      const lifetimeAct = '--C--1-------D' // See AppLifetimeEvent
      const tradeStream = '     --0--1----2----3---4'
      const oooexpected = '-------0--1----2--'  // Although 2 is actually unexpected, because it's after 'D', there are some race conditions due to the way the test scheduler works that we can just accept.

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = new MockServiceStubWithLoadBalancer(() => fromMarbles(toRawTradeUpdate, cold, tradeStream))
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockLifetimeAction$(cold(lifetimeAct), lifetimeAct1)

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(fromTradeActionsToMarbles(epic)).toBe(oooexpected)
    })
  })
})

/*
 * The marbles for custom actions such as mount/subscription must be specified 
 * between the 'C' and 'D' marbles within your marble diagram, although both of
 * the 'C' and 'D' marbles theselves are optional.
 * 
 * 
 * The marbles that represent your custom actions MUST be monotonically 
 * increasing numbers, starting at the number 1.
 * 
 * EXAMPLES
 *   Valid: ''                   -- No ations are generated.
 *   Valid: '--C--'              -- Only the app connected action is generated.
 *   Valid: '--C------D----'     -- Generates the app connected action, followed eventually by the disconnected action.
 *   Valid: '-C----1-D|'         -- App connected, then custom action #1 is eventually generated, and finally the disconnected action.
 *   Valid: '-C----1---'         -- App connected, then custom action #1 is eventually generated, and no further actions appear.
 *   Valid: '--C--1--2--3--D--'  -- App connected, then custom actions ##1, 2, 3, and finally the disconnected action.
 *   Valid: '---1--C---'         -- Custom action #1, then the app connected action.
 *   Valid: '--1--C--2--'        -- Custom action #1, then the app connected action, and finally custom action #2.
 *
 * Invalid: '--C--0--D--'        -- Custom actions' marbles must start at 1
 * Invalid: '--C--1--4--'        -- Custom actions' marbles must increase monotonically; e.g., 1, 2, 3, 4, 5...
 * Invalid: '--C--a--b--e--D--'  -- Custom actions' marbles cannot be letters.
 * Invalid: '--C--C--1--2--D--'  -- Only one 'C' marble is permitted. Likewise, only one 'D' marble is permitted as well.
 * 
 */
enum AppLifetimeEvent {
  Connect = 'C',
  Disconnect = 'D'
}

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

function mockLifetimeAction$(
  action$: Observable<string>,
  ...actionFactories: Array<() => Action<any>>
): Observable<Action<any>> {
  return mockAction$(
    action$,
    getFactoryIndex,
    ...[ConnectionActions.connect, ...actionFactories, ConnectionActions.disconnect],
  )

  function getFactoryIndex(lifetimeEvent: string): number {
    if (lifetimeEvent === AppLifetimeEvent.Connect) { return 0; }
    else if (lifetimeEvent === AppLifetimeEvent.Disconnect) { return actionFactories.length + 1; }
    else { return parseInt(lifetimeEvent); }
  }
}

function mockAction$<TActionId>(
  action$: Observable<TActionId>,
  getFactoryIndex: (actionId: TActionId) => number,
  ...actionFactories: Array<() => Action<any>>
): Observable<Action<any>> {
  return action$.pipe(map(actionId => actionFactories[getFactoryIndex(actionId)]()))
}

function fromMarbles<TResult>(
  selector: (name: string | number | {}) => TResult,
  cold: (marbles: string) => Observable<{}>,
  serviceStream: string): Observable<TResult> {
  return cold(serviceStream).pipe(map(selector));
}

function fromActionsToMarbles<TPayload>(
  action$: Observable<ActionWithPayload<any, TPayload> | Action<any>>,
  marbleSelector: (action: ActionWithPayload<any, TPayload>) => number | string | {}) {
  return action$.pipe(map(action => marbleSelector(action as ActionWithPayload<any, TPayload>)));
}

function fromTradeActionsToMarbles(action$: Observable<ActionWithPayload<any, TradesUpdate> | Action<any>>) {
  return fromActionsToMarbles(action$, fromTradeActionToMarble);
}

function fromTradeActionToMarble({ payload: { trades } }: ActionWithPayload<any, TradesUpdate>) {
  return trades[0].tradeId.toString();
}

function toRawTradeUpdate(marble: string | number | {}): RawTradeUpdate {
  const tradeId = typeof marble === 'number' ? marble : parseInt(marble.toString())
  const snapshot = tradeId === 0
  return {
    IsStateOfTheWorld: snapshot,
    IsStale: false,
    Trades: snapshot
      ? Array.from(Array(10).keys()).map(i => ({
        TradeId: tradeId + i,
        CurrencyPair: 'USD/EUP',
        TraderName: 'bob',
        Notional: i * 100,
        DealtCurrency: 'USD',
        Direction: Direction.Buy,
        Status: 'PENDING',
        SpotRate: i * 100,
        TradeDate: new Date().toString(),
        ValueDate: new Date().toString(),
      }))
      : [
        {
          TradeId: tradeId,
          CurrencyPair: 'USD/EUP',
          TraderName: 'bob',
          Notional: Math.random() * 100,
          DealtCurrency: 'USD',
          Direction: Direction.Buy,
          Status: 'PENDING',
          SpotRate: Math.random() * 100,
          TradeDate: new Date().toString(),
          ValueDate: new Date().toString(),
        },
      ],
  }
}
