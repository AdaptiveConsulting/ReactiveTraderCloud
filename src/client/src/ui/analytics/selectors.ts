import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

import { getModel } from './model/AnalyticsLineChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'

const getCurrencyPairs = ({ currencyPairs }: GlobalState) => currencyPairs
const selectCurrencyPairs = createSelector([getCurrencyPairs], currencyPairs => currencyPairs)

const getCurrentPositions = ({ analyticsService }: GlobalState) => analyticsService && analyticsService.currentPositions
const selectPositionsChartModel = createSelector([getCurrentPositions], currentPositions =>
  getPositionsChartModel(currentPositions),
)

const getHistory = ({ analyticsService }: GlobalState) => analyticsService && analyticsService.history
const selectAnalyticsLineChartModel = createSelector([getHistory], history => getModel(history))

const getConnectionStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.analytics.connectionStatus
const selectAnalyticsStatus = createSelector(getConnectionStatus, status => status)

export { selectPositionsChartModel, selectAnalyticsLineChartModel, selectAnalyticsStatus, selectCurrencyPairs }
