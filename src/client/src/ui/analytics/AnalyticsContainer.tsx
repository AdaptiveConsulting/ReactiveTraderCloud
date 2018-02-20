import * as React from 'react'
import { connect } from 'react-redux'
import * as PropTypes from 'prop-types'
import { getPnlChartModel } from './model/pnlChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'
import Analytics from './Analytics'
import './AnalyticsStyles.scss'
import Environment from '../../system/environment'
import { addRegion, openWindow, regionsSettings } from '../common/regions/regionsOperations'
import { CurrencyPair } from '../../types/currencyPair'

const analyticsRegionSettings = regionsSettings('Analytics', 400, 800, false)

interface AnalyticsContainerOwnProps {

}

interface AnalyticsContainerStateProps {
  isConnected: boolean
  displayAnalytics: boolean
  analyticsService: any
  currencyPairs: CurrencyPair[]
}

interface AnalyticsContainerDispatchProps {
  onPopoutClick: (any) => any
  onComponentMount: () => void
}

type AnalyticsContainerProps = AnalyticsContainerOwnProps & AnalyticsContainerStateProps & AnalyticsContainerDispatchProps

class AnalyticsContainer extends React.Component<AnalyticsContainerProps, any> {

  static contextTypes = {
    openFin: PropTypes.object
  }

  public componentDidMount() {
    this.props.onComponentMount()
  }

  render() {

    const { analyticsService, isConnected, currencyPairs } = this.props
    const openFin = this.context.openFin
    const positionsChartModel = getPositionsChartModel(analyticsService.currentPositions)
    const pnlChartModel = getPnlChartModel(analyticsService.history)
    const canPopout = Environment.isRunningInIE()
    const onPopoutClick = this.props.onPopoutClick(openFin)
    return (
      <Analytics currencyPairs={currencyPairs}
                 canPopout={canPopout}
                 isConnected={isConnected}
                 onPopoutClick={onPopoutClick}
                 pnlChartModel={pnlChartModel}
                 positionsChartModel={positionsChartModel}/>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPopoutClick: (openFin) => {
      return () => { dispatch(openWindow(analyticsRegion, openFin))}
    },
    onComponentMount: () => {
      dispatch(addRegion(analyticsRegion))
    },
  }
}

function mapStateToProps(state: any) {
  const { analyticsService, compositeStatusService, displayAnalytics, currencyPairs } = state
  const isConnected =  compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected || false
  return { analyticsService, isConnected, displayAnalytics, currencyPairs }
}

const ConnectedAnalyticsContainer = connect(mapStateToProps, mapDispatchToProps)(AnalyticsContainer)

const analyticsRegion = {
  id: 'analytics',
  isTearedOff: false,
  container: ConnectedAnalyticsContainer,
  settings: analyticsRegionSettings,
}

export default ConnectedAnalyticsContainer
