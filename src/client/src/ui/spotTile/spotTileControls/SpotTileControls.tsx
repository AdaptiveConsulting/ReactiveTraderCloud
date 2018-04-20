import * as classnames from 'classnames'
import * as React from 'react'
import Environment from '../../../system/environment'

interface SpotTileControlsProps {
  isRunningInOpenFin: boolean
  currencyChartIsOpening: boolean
  displayCurrencyChart: () => void
  onPopoutClick: () => void
  undockTile: () => void
}

export default class SpotTileControls extends React.Component<SpotTileControlsProps, {}> {

  render() {

    const { isRunningInOpenFin, currencyChartIsOpening, displayCurrencyChart, undockTile, onPopoutClick } = this.props
    const canPopout = Environment.isRunningInIE()

    const newWindowClassName = classnames('popout__controls  glyphicon glyphicon-new-window', {
      'spot-tile__icon--tearoff': !canPopout,
      'spot-tile__icon--hidden': canPopout,
    })

    const chartIQIconClassName = classnames({
      'spot-tile__icon--hidden': !isRunningInOpenFin,
      'glyphicon glyphicon-refresh spot-tile__icon--rotate': currencyChartIsOpening,
      'spot-tile__icon--chart glyphicon glyphicon-stats': !currencyChartIsOpening,
    })

    return (<div className="spot-tile-controls">
      <i className={chartIQIconClassName}
         onClick={() => displayCurrencyChart()}/>
      <i className={newWindowClassName}
         onClick={() => onPopoutClick()}/>
      <i className="popout__undock spot-tile__icon--undock glyphicon glyphicon-log-out"
         onClick={() => undockTile()}/>
    </div>)
  }
}
