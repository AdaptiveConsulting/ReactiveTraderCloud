import { MockScheduler } from 'rt-testing'
import { referenceServiceEpic } from './epics'
import { Action } from 'redux'
import { ActionsObservable } from 'redux-observable'
import ReferenceDataService from './referenceDataService'
import { of } from 'rxjs'
import { ApplicationDependencies } from 'applicationServices'
import { ConnectionActions, ReferenceActions } from 'rt-actions'
import { MockCurrencyPair } from './__mocks__'

describe('Reference Epics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should start generating trade actions only when application connects', () => {
    const testScheduler = new MockScheduler()
    const connectAction = ConnectionActions.connect()
    const data = { Updates: MockCurrencyPair({}) }
    const expectedAction = ReferenceActions.createReferenceServiceAction(data)
    delete expectedAction['error']

    testScheduler.run(({ cold, expectObservable }) => {
      const referenceDataService = new MockReferenceDataService()
      const actionLifetime = '-a-a-c-a--'
      const expectedLitetime = '-----a--'
      const source$ = cold<Action<any>>(actionLifetime, { c: connectAction, a: data })
      const action$ = ActionsObservable.from(source$, testScheduler)
      const epics$ = referenceServiceEpic(action$, undefined, { referenceDataService } as ApplicationDependencies)
      expectObservable(epics$).toBe(expectedLitetime, { a: expectedAction })
    })
  })

  it('Should not generate trade actions when the application disconnects', () => {
    const testScheduler = new MockScheduler()
    const connectAction = ConnectionActions.connect()
    const disconnectAction = ConnectionActions.disconnect()
    const data = { Updates: MockCurrencyPair({}) }

    const expectedAction = ReferenceActions.createReferenceServiceAction(data)
    delete expectedAction['error']

    testScheduler.run(({ cold, expectObservable }) => {
      const referenceDataService = new MockReferenceDataService()
      const st = cold<Action<any>>('c-a-daaa', { c: connectAction, a: data, d: disconnectAction })
      const action$ = ActionsObservable.from(st, testScheduler)
      const epics$ = referenceServiceEpic(action$, undefined, { referenceDataService } as ApplicationDependencies)
      expectObservable(epics$).toBe('a----', { a: expectedAction })
    })
  })
})

const MockReferenceDataService = jest.fn<ReferenceDataService>(() => ({
  getCurrencyPairUpdates$: () =>
    of({
      Updates: MockCurrencyPair({}),
    }),
}))
