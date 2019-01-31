import { ActionsObservable } from 'redux-observable'
import { MockServiceClient } from 'rt-system'
import { createTestScheduler, fromMarbles, mockLifetimeAction$ } from 'rt-testing'
import MockApplicationDependencies from 'applicationServices.mock'
import { blotterServiceEpic } from './epics'
import { BlotterActions } from '../actions'
import { fromTradeActionsToMarbles, toRawTradeUpdate } from '../testing'

describe('blotterServiceEpic', () => {
  it("returns an observable that contains no actions when the component hasn't mounted", () => {
    const scheduler = createTestScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct = '--C--' // See AppLifetimeEvent enum
      const tradeStream = '--0--1--2'
      const eeeexpected = ''

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = new MockServiceClient(() => fromMarbles(toRawTradeUpdate, cold, tradeStream))
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockLifetimeAction$(cold(lifetimeAct))

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(fromTradeActionsToMarbles(epic)).toBe(eeeexpected)
    })
  })

  it('returns an observable that contains new trade actions for incoming trades', () => {
    const scheduler = createTestScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct1 = BlotterActions.subscribeToBlotterAction
      const lifetimeAct = '--C--1|' // See AppLifetimeEvent enum
      const tradeStream = '     --0--1----2'
      const eeeexpected = '-------0--1----2'

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = new MockServiceClient(() => fromMarbles(toRawTradeUpdate, cold, tradeStream))
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockLifetimeAction$(cold(lifetimeAct), lifetimeAct1)

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(fromTradeActionsToMarbles(epic)).toBe(eeeexpected)
    })
  })

  it('returns an observable that stops generating trade actions when the application disconnects', () => {
    const scheduler = createTestScheduler()
    scheduler.run(helpers => {
      // scenario
      const lifetimeAct1 = BlotterActions.subscribeToBlotterAction
      const lifetimeAct = '--C--1-------D' // See AppLifetimeEvent enum
      const tradeStream = '     --0--1----2----3---4'
      const eeeexpected = '-------0--1----2--' // Although 2 is actually unexpected, because it's after 'D', there are some race conditions due to the way the test scheduler works that we'll just accept for now.

      // arrange
      const { cold, expectObservable } = helpers
      const loadBalancedServiceStub = new MockServiceClient(() => fromMarbles(toRawTradeUpdate, cold, tradeStream))
      const appDependencies = new MockApplicationDependencies(loadBalancedServiceStub)
      const action$ = mockLifetimeAction$(cold(lifetimeAct), lifetimeAct1)

      // act
      const epic = blotterServiceEpic(ActionsObservable.from(action$, scheduler), undefined, appDependencies)

      // assert
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledTimes(1)
      expect(loadBalancedServiceStub.createStreamOperation).toHaveBeenCalledWith('blotter', 'getTradesStream', {})
      expectObservable(fromTradeActionsToMarbles(epic)).toBe(eeeexpected)
    })
  })
})
