import classnames from 'classnames'
import React from 'react'
import { Environment } from '../../../../system'

interface SpotTileControlsProps {
  isRunningOnDesktop: boolean
  currencyChartIsOpening: boolean
  displayCurrencyChart: () => void
  onPopoutClick: () => void
  undockTile: () => void
  tornOff: boolean
}

export default class SpotTileControls extends React.Component<SpotTileControlsProps, {}> {
  render() {
    const {
      isRunningOnDesktop,
      currencyChartIsOpening,
      displayCurrencyChart,
      undockTile,
      onPopoutClick,
      tornOff
    } = this.props
    const canPopout = Environment.isRunningInIE() || tornOff

    const newWindowClassName = classnames('popout__controls  glyphicon glyphicon-new-window', {
      'spot-tile__icon--tearoff': !canPopout,
      'spot-tile__icon--hidden': canPopout
    })

    const chartIQIconClassName = classnames({
      'spot-tile__icon--hidden': !isRunningOnDesktop,
      'glyphicon glyphicon-refresh spot-tile__icon--rotate': currencyChartIsOpening,
      'spot-tile__icon--chart glyphicon glyphicon-stats': !currencyChartIsOpening
    })

    return (
      <div className="spot-tile-controls">
        <i className={chartIQIconClassName} onClick={() => displayCurrencyChart()} />
        <i className={newWindowClassName} onClick={() => onPopoutClick()} />
        <i
          className="popout__undock spot-tile__icon--undock glyphicon glyphicon-log-out"
          onClick={() => undockTile()}
        />
      </div>
    )
  }
}
