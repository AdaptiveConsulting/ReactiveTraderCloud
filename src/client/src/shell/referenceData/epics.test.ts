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
  it('Should not generate trade action if application is not connected', () => {
    const testScheduler = new MockScheduler()
    const randomAction = { type: 'random' }
    testScheduler.run(({ cold, expectObservable }) => {
      const referenceDataService = new MockReferenceDataService()
      const st = cold<Action<any>>('a-aa-|', { a: randomAction })
      const action$ = ActionsObservable.from(st, testScheduler)
      const epics$ = referenceServiceEpic(action$, undefined, { referenceDataService } as ApplicationDependencies)
      expectObservable(epics$).toBe('-----|')
    })
  })

  it('Should only generate trade actions when application connects', () => {
    const testScheduler = new MockScheduler()
    const connectAction = ConnectionActions.connect()
    const data = { Updates: MockCurrencyPair({}) }
    const expectedAction = ReferenceActions.createReferenceServiceAction(data)
    delete expectedAction['error']
    testScheduler.run(({ cold, expectObservable }) => {
      const referenceDataService = new MockReferenceDataService()
      const st = cold<Action<any>>('c-a--', { c: connectAction, a: data })
      const action$ = ActionsObservable.from(st, testScheduler)
      const epics$ = referenceServiceEpic(action$, undefined, { referenceDataService } as ApplicationDependencies)
      expectObservable(epics$).toBe('a----', { a: expectedAction })
    })
  })

  it('Should stop generating trade actions when the application disconnects', () => {
    const testScheduler = new MockScheduler()
    const connectAction = ConnectionActions.connect()
    const disconnectAction = ConnectionActions.disconnect()
    const data = { Updates: MockCurrencyPair({}) }

    const expectedAction = ReferenceActions.createReferenceServiceAction(data)
    delete expectedAction['error']

    testScheduler.run(({ cold, expectObservable }) => {
      const referenceDataService = new MockReferenceDataService()
      const st = cold<Action<any>>('c-a-da-a', { c: connectAction, a: data, d: disconnectAction })
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
