import AnalyticsService from './analyticsService'
import { MockScheduler } from 'rt-testing'
import { MockServiceClient } from 'rt-system/__mocks__'
import { PositionsRaw } from './model/index'
import { map, tap } from 'rxjs/operators'

const position = {
  CurrentPositions: [],
  History: [],
}

const positionRaw = {
  CurrentPositions: [],
  History: [],
}

describe('AnalyticsService getAnalyticsStream', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should call createStreamOperation', () => {
    const actionReference = {
      p: positionRaw,
    }
    new MockScheduler().run(({ cold, expectObservable, flush }) => {
      const actionLifetime = '--p--'
      const createStreamOperation$ = jest.fn((s: string, o: string, r: any) =>
        cold<PositionsRaw>(actionLifetime, actionReference),
      )
      const serviceClient = new MockServiceClient(createStreamOperation$)
      const analyticsService = new AnalyticsService(serviceClient)
      const epics$ = analyticsService.getAnalyticsStream('USD').pipe(
        tap(pos => console.log(pos)),
        map(pos => pos.currentPositions === [] && pos.history === []),
      )
      expectObservable(epics$).toBe('--p--', { p: true })
      expect(createStreamOperation$).toHaveBeenCalled()
      expect(1).toBe(1)
    })
  })

  it('Should call createStreamOperation and correctly map positionRaw to positionUpdates', () => {})
})
