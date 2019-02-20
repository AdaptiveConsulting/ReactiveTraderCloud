import { MockScheduler } from 'rt-testing'
import { referenceServiceEpic } from './epics'
import { Action } from 'redux'
import { ActionsObservable } from 'redux-observable'
import { of } from 'rxjs'
import { ConnectionActions, ReferenceActions } from 'rt-actions'
import { CurrencyPair, CurrencyPairMap } from 'rt-types'

const currencyPair = {
  symbol: 'USDYAN',
  ratePrecision: 2.0,
  pipsPosition: 4.6,
  base: 'USD',
  terms: 'YAN',
}

const MockCurrencyPair = (overrides: Partial<CurrencyPair>) => ({
  ...currencyPair,
  ...overrides,
})

describe('Reference Epics', () => {
  const connectAction = ConnectionActions.connect()
  const disconnectAction = ConnectionActions.disconnect()
  const currencyPair = { USDYAN: MockCurrencyPair({}) }

  const expectedAction = ReferenceActions.createReferenceServiceAction(currencyPair)
  delete expectedAction['error']

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should start generating trade actions only when application connects', () => {
    const testScheduler = new MockScheduler()
    const actionReference = { c: connectAction, a: currencyPair }
    const expectReference = { a: expectedAction }

    testScheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = '-a-a-c-a--'
      const expectLitetime = '-----a'

      const referenceDataService$ = of<CurrencyPairMap>(currencyPair)
      const source$ = cold<Action<any>>(actionLifetime, actionReference)
      const action$ = ActionsObservable.from(source$, testScheduler)

      const epics$ = referenceServiceEpic(action$, undefined, { referenceDataService$ })
      expectObservable(epics$).toBe(expectLitetime, expectReference)
    })
  })

  it('Should not generate trade actions when the application disconnects', () => {
    const testScheduler = new MockScheduler()

    const actionReference = { c: connectAction, a: currencyPair, d: disconnectAction }
    const expectReference = { a: expectedAction }

    testScheduler.run(({ cold, expectObservable }) => {
      const actionLifetime = 'c-a-daaa'
      const expectLifetime = 'a----'

      const referenceDataService$ = of<CurrencyPairMap>(currencyPair)

      const source$ = cold<Action<any>>(actionLifetime, actionReference)
      const action$ = ActionsObservable.from(source$, testScheduler)

      const epics$ = referenceServiceEpic(action$, undefined, { referenceDataService$ })
      expectObservable(epics$).toBe(expectLifetime, expectReference)
    })
  })
})
