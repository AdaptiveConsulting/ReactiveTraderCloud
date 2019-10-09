import { IDLE_TIME_MS, rfqReceivedEpic, rfqRequestEpic } from './rfqEpics'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { Action } from 'redux'
import { MockScheduler } from 'rt-testing'
import { CurrencyPair } from 'rt-types'
import { DeepPartial } from 'rt-util'
import { GlobalState } from 'StoreTypes'
import { TILE_ACTION_TYPES } from '../actions'
import { getDefaultNotionalValue } from '../components/Tile/TileBusinessLogic'

describe('rfqEpics', () => {
  const currencyPair: CurrencyPair = {
    symbol: 'EURUSD',
    ratePrecision: 5,
    pipsPosition: 4,
    base: 'EUR',
    terms: 'USD',
  }

  const mockState: DeepPartial<GlobalState> = {
    currencyPairs: {
      [currencyPair.symbol]: currencyPair,
    },
    spotTilesData: {
      [currencyPair.symbol]: {
        price: {
          ask: 1.09317,
          bid: 1.09283,
        },
      },
    },
  }

  describe('rfqRequestEpic', () => {
    const inputActions = {
      a: {
        type: TILE_ACTION_TYPES.RFQ_REQUEST,
        payload: { currencyPair, notional: 1000 },
      },
      b: {
        type: TILE_ACTION_TYPES.RFQ_CANCEL,
        payload: { currencyPair },
      },
      c: {
        type: TILE_ACTION_TYPES.RFQ_CANCEL,
        payload: {
          currencyPair: { symbol: 'GBPJPY' },
        },
      },
    }

    const outputActions = {
      a: {
        type: TILE_ACTION_TYPES.RFQ_RECEIVED,
        payload: {
          notional: 1000,
          currencyPair,
          price: {
            ask: 1.0932,
            bid: 1.0928,
          },
          timeout: 10000,
        },
      },
    }

    it('should fetchRfqQuote with rfq data after delay', () => {
      const testScheduler = new MockScheduler()

      testScheduler.run(({ cold, expectObservable }) => {
        const actionLifetime = '-a 499ms --|'
        const expectedAction = '-- 499ms a-|'

        const coldAction = cold<Action<any>>(actionLifetime, inputActions)

        const action$ = ActionsObservable.from(coldAction, testScheduler)
        const state$ = { value: mockState } as StateObservable<GlobalState>
        const epics$ = rfqRequestEpic(action$, state$, {})

        expectObservable(epics$).toBe(expectedAction, outputActions)
      })
    })

    describe('when rfq is cancelled before delay', () => {
      it('should not fetchRfqQuote', () => {
        const testScheduler = new MockScheduler()

        testScheduler.run(({ cold, expectObservable }) => {
          const actionLifetime = '-a 99ms b 399ms -|'
          const expectedAction = '--        499ms -|'

          const coldAction = cold<Action<any>>(actionLifetime, inputActions)

          const action$ = ActionsObservable.from(coldAction, testScheduler)
          const state$ = { value: mockState } as StateObservable<GlobalState>
          const epics$ = rfqRequestEpic(action$, state$, {})

          expectObservable(epics$).toBe(expectedAction, outputActions)
        })
      })
    })

    describe('when some other rfq is cancelled before delay', () => {
      it('should fetchRfqQuote with rfq data after delay', () => {
        const testScheduler = new MockScheduler()

        testScheduler.run(({ cold, expectObservable }) => {
          const actionLifetime = '-a 99ms c 399ms --|'
          const expectedAction = '--        499ms a-|'

          const coldAction = cold<Action<any>>(actionLifetime, inputActions)

          const action$ = ActionsObservable.from(coldAction, testScheduler)
          const state$ = { value: mockState } as StateObservable<GlobalState>
          const epics$ = rfqRequestEpic(action$, state$, {})

          expectObservable(epics$).toBe(expectedAction, outputActions)
        })
      })
    })
  })

  describe('rfqReceivedEpic', () => {
    const inputActions = {
      a: {
        type: TILE_ACTION_TYPES.RFQ_RECEIVED,
        payload: { currencyPair, timeout: 10000 },
      },
      b: {
        type: TILE_ACTION_TYPES.RFQ_REJECT,
        payload: { currencyPair },
      },
      c: {
        type: TILE_ACTION_TYPES.RFQ_EXPIRED,
        payload: { currencyPair },
      },
      d: {
        type: TILE_ACTION_TYPES.RFQ_RESET,
        payload: { currencyPair },
      },
      e: {
        type: TILE_ACTION_TYPES.RFQ_REJECT,
        payload: { currencyPair: { symbol: 'GBPJPY' } },
      },
      f: {
        type: TILE_ACTION_TYPES.RFQ_EXPIRED,
        payload: { currencyPair: { symbol: 'GBPJPY' } },
      },
      g: {
        type: TILE_ACTION_TYPES.RFQ_RESET,
        payload: { currencyPair: { symbol: 'GBPJPY' } },
      },
    }

    const outputActions = {
      a: {
        type: TILE_ACTION_TYPES.RFQ_EXPIRED,
        payload: { currencyPair },
      },
      b: {
        type: TILE_ACTION_TYPES.SET_NOTIONAL,
        payload: {
          currencyPair: currencyPair.symbol,
          notional: getDefaultNotionalValue(),
        },
      },
      c: {
        type: TILE_ACTION_TYPES.SET_TRADING_MODE,
        payload: {
          symbol: currencyPair.symbol,
          mode: 'esp',
        },
      },
      d: {
        type: TILE_ACTION_TYPES.RFQ_RESET,
        payload: { currencyPair },
      },
    }

    it('should expire rfq after timeout (+ 1 second), and reset rfq after idle time', () => {
      const testScheduler = new MockScheduler()

      testScheduler.run(({ cold, expectObservable }) => {
        const actionLifetime = '-a 10999ms --|'
        const expectedAction = `-- 10999ms a ${IDLE_TIME_MS - 1}ms (bcd|)`

        const coldAction = cold<Action<any>>(actionLifetime, inputActions)

        const action$ = ActionsObservable.from(coldAction, testScheduler)
        const state$ = { value: mockState } as StateObservable<GlobalState>
        const epics$ = rfqReceivedEpic(action$, state$, {})

        expectObservable(epics$).toBe(expectedAction, outputActions)
      })
    })

    it('should stop counting idle time when user resets rfq', () => {
      const testScheduler = new MockScheduler()

      testScheduler.run(({ cold, expectObservable }) => {
        const actionLifetime = '-a 10999ms --d|'
        const expectedAction = `-- 10999ms a--|`

        const coldAction = cold<Action<any>>(actionLifetime, inputActions)

        const action$ = ActionsObservable.from(coldAction, testScheduler)
        const state$ = { value: mockState } as StateObservable<GlobalState>
        const epics$ = rfqReceivedEpic(action$, state$, {})

        expectObservable(epics$).toBe(expectedAction, outputActions)
      })
    })

    const expiryCases = [['rejected', 'b', 'e'], ['reset', 'd', 'g']]

    expiryCases.forEach(([action, key, otherKey]) => {
      describe(`when rfq is ${action}`, () => {
        it('should not expire rfq', () => {
          const testScheduler = new MockScheduler()

          testScheduler.run(({ cold, expectObservable }) => {
            const actionLifetime = `-a 9999ms ${key} 999ms   -|`
            const expectedAction = '--               10999ms -|'

            const coldAction = cold<Action<any>>(actionLifetime, inputActions)

            const action$ = ActionsObservable.from(coldAction, testScheduler)
            const state$ = { value: mockState } as StateObservable<GlobalState>
            const epics$ = rfqReceivedEpic(action$, state$, {})

            expectObservable(epics$).toBe(expectedAction, outputActions)
          })
        })
      })

      describe(`when some other rfq is ${action}`, () => {
        it('should expire rfq after timeout (+ 1 second), and reset rfq after idle time', () => {
          const testScheduler = new MockScheduler()

          testScheduler.run(({ cold, expectObservable }) => {
            const actionLifetime = `-a 9999ms ${otherKey} 999ms   --|`
            const expectedAction = `-- 10999ms a ${IDLE_TIME_MS - 1}ms (bcd|)`

            const coldAction = cold<Action<any>>(actionLifetime, inputActions)

            const action$ = ActionsObservable.from(coldAction, testScheduler)
            const state$ = { value: mockState } as StateObservable<GlobalState>
            const epics$ = rfqReceivedEpic(action$, state$, {})

            expectObservable(epics$).toBe(expectedAction, outputActions)
          })
        })
      })
    })
  })
})
