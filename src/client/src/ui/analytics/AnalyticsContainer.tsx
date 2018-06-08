import * as React from 'react'
import { connect } from 'react-redux'
import { Environment } from '../../system'
import { RegionSettings } from '../../types'
import { CurrencyPair } from '../../types/currencyPair'
import { addRegion, openWindow } from '../../ui/common/regions/regionsOperations'
import Analytics from './Analytics'
import { getPnlChartModel } from './model/pnlChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'

const analyticsRegionSettings: RegionSettings = {
  title: 'Analytics',
  width: 400,
  height: 800,
  dockable: false,
  resizable: false
}

interface AnalyticsContainerStateProps {
  isConnected: boolean
  displayAnalytics: boolean
  analyticsService: any
  currencyPairs: CurrencyPair[]
}

interface AnalyticsContainerDispatchProps {
  onPopoutClick: () => any
  onComponentMount: () => void
}

type AnalyticsContainerProps = AnalyticsContainerStateProps & AnalyticsContainerDispatchProps

class AnalyticsContainer extends React.Component<AnalyticsContainerProps, any> {
  public componentDidMount() {
    this.props.onComponentMount()
  }

  render() {
    const { analyticsService, isConnected, currencyPairs } = this.props
    const positionsChartModel = getPositionsChartModel(analyticsService.currentPositions)
    const pnlChartModel = getPnlChartModel(analyticsService.history)
    const canPopout = Environment.isRunningInIE()
    const onPopoutClick = this.props.onPopoutClick()
    return (
      <Analytics
        currencyPairs={currencyPairs}
        canPopout={canPopout}
        isConnected={isConnected}
        onPopoutClick={onPopoutClick}
        pnlChartModel={pnlChartModel}
        positionsChartModel={positionsChartModel}
      />
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onPopoutClick: () => {
      return () => {
        dispatch(openWindow(analyticsRegion))
      }
    },
    onComponentMount: () => {
      dispatch(addRegion(analyticsRegion))
    }
  }
}

function mapStateToProps(state: any) {
  const { analyticsService, compositeStatusService, displayAnalytics, currencyPairs } = state
  const isConnected =
    (compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected) ||
    false
  return { analyticsService, isConnected, displayAnalytics, currencyPairs }
}

const ConnectedAnalyticsContainer = connect(mapStateToProps, mapDispatchToProps)(AnalyticsContainer)

const analyticsRegion = {
  id: 'analytics',
  isTearedOff: false,
  container: ConnectedAnalyticsContainer,
  settings: analyticsRegionSettings
}

export default ConnectedAnalyticsContainer
