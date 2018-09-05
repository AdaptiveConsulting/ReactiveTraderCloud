import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

import { ServiceConnectionStatus } from 'rt-types'
import { getPnlChartModel } from './model/pnlChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'

const getCurrencyPairs = ({ currencyPairs }: GlobalState) => currencyPairs
const selectCurrencyPairs = createSelector([getCurrencyPairs], currencyPairs => currencyPairs)

const getCurrentPositions = ({ analyticsService }: GlobalState) => analyticsService && analyticsService.currentPositions
const selectPositionsChartModel = createSelector([getCurrentPositions], currentPositions =>
  getPositionsChartModel(currentPositions)
)

const getHistory = ({ analyticsService }: GlobalState) => analyticsService && analyticsService.history
const selectPnlChartModel = createSelector([getHistory], history => getPnlChartModel(history))

const getConnectionStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.analytics.connectionStatus === ServiceConnectionStatus.CONNECTED
const selectAnalyticsStatus = createSelector(getConnectionStatus, status => status)

export { selectPositionsChartModel, selectPnlChartModel, selectAnalyticsStatus, selectCurrencyPairs }
