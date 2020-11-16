import AnalyticsService from './analyticsService'
import { MockScheduler } from 'rt-testing'
import { PositionsRaw } from './model'
import { map } from 'rxjs/operators'
import { ServiceClient } from 'rt-system'
import { Observable } from 'rxjs'

const positionRaw = {
  CurrentPositions: [] as any[],
  History: [] as any[],
}

describe('AnalyticsService getAnalyticsStream', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should call createStreamOperation', () => {
    const actionReference = {
      p: positionRaw,
    }
    new MockScheduler().run(({ cold, expectObservable }) => {
      const actionLifetime = '--p--'
      const createStreamOperation = jest.fn((s: string, o: string, r: any) =>
        cold<PositionsRaw>(actionLifetime, actionReference)
      )
      const serviceClient = ({ createStreamOperation } as any) as ServiceClient
      const analyticsService = new AnalyticsService(serviceClient as ServiceClient)
      const epics$ = analyticsService
        .getAnalyticsStream('USD')
        .pipe(
          map(
            ({ currentPositions, history }) => currentPositions.length === 0 && history.length === 0
          )
        )

      expectObservable(epics$).toBe('--p--', { p: true })
      expect(createStreamOperation).toHaveBeenCalled()
      expect(createStreamOperation).toHaveBeenCalledWith('analytics', 'getAnalytics', 'USD')
    })
  })

  it('Should correctly map positionRaw to positionUpdates', () => {
    const actionReference = {
      p: {
        CurrentPositions: [{ Symbol: 'AAPL', BasePnl: 5, BaseTradedAmount: 5 }],
        History: [{ Timestamp: '2019-02-20', UsdPnl: 5 }],
      },
    }
    new MockScheduler().run(({ cold, expectObservable }) => {
      const actionLifetime = '--p--'
      const createStreamOperation = jest.fn((s: string, o: string, r: any) =>
        cold<PositionsRaw>(actionLifetime, actionReference)
      )

      const serviceClient = ({ createStreamOperation } as any) as ServiceClient
      const analyticsService = new AnalyticsService(serviceClient as ServiceClient)
      const epics$ = analyticsService
        .getAnalyticsStream('USD')
        .pipe(map(({ currentPositions }) => currentPositions[0].basePnlName === 'basePnl'))

      expectObservable(epics$).toBe('--p--', { p: true })
    })
  })
})
