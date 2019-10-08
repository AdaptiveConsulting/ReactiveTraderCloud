import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { AnalyticsActions } from './actions'
import Analytics from './components'
import {
  selectAnalyticsStatus,
  selectCurrencyPairs,
  selectAnalyticsLineChartModel,
  selectPositionsChartModel,
} from './selectors'
import { usePlatform } from 'rt-platforms'

interface AnalyticsContainerOwnProps {
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
  inExternalWindow?: boolean
}

const mapStateToProps = (state: GlobalState) => ({
  analyticsLineChartModel: selectAnalyticsLineChartModel(state),
  positionsChartModel: selectPositionsChartModel(state),
  status: selectAnalyticsStatus(state),
  currencyPairs: selectCurrencyPairs(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMount: () => dispatch(AnalyticsActions.subcribeToAnalytics()),
})

type AnalyticsContainerStateProps = ReturnType<typeof mapStateToProps>
type AnalyticsContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type AnalyticsContainerProps = AnalyticsContainerStateProps &
  AnalyticsContainerDispatchProps &
  AnalyticsContainerOwnProps

const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({
  status,
  onMount,
  tearable = false,
  tornOff,
  inExternalWindow = false,
  ...props
}) => {
  const { allowTearOff } = usePlatform()
  return (
    <Loadable
      minWidth={22}
      onMount={onMount}
      status={status}
      render={() => (
        <Analytics
          {...props}
          inExternalWindow={inExternalWindow}
          canPopout={tearable && allowTearOff && !tornOff}
        />
      )}
      message="Analytics Disconnected"
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalyticsContainer)
