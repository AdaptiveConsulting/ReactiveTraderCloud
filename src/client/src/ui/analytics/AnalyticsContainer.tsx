import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { GlobalState } from 'StoreTypes'
import { AnalyticsActions } from './actions'
import Analytics from './components'
import { selectAnalyticsStatus, selectCurrencyPairs, selectPnlChartModel, selectPositionsChartModel } from './selectors'

const mapStateToProps = (state: GlobalState) => ({
  pnlChartModel: selectPnlChartModel(state),
  positionsChartModel: selectPositionsChartModel(state),
  isConnected: selectAnalyticsStatus(state),
  currencyPairs: selectCurrencyPairs(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMount: () => dispatch(AnalyticsActions.subcribeToAnalytics())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Analytics)
