import * as _ from 'lodash'
import * as React from 'react'
import './workspace.scss'
import { connect } from 'react-redux'
import SpotTile from '../spotTile/SpotTile'
import { CurrencyPair, Direction } from '../../types'
import { Dispatch } from 'redux'
import { executeTrade, undockTile, displayCurrencyChart, spotRegionSettings, dismissNotification } from '../spotTile/spotTileOperations'
// @todo: move (and possiblly rename) the region  related methods to RegionOperations
import { onComponentMount, onPopoutClick } from '../blotter/blotterOperations'
import { RegionWrapper } from '../../regions'
import { Environment } from '../../system'


interface WorkspaceContainerOwnProps {

}

interface WorkspaceContainerStateProps {
  children: any
  referenceService: any
  spotTiles: any
  isConnected: boolean
  compositeStatusService: any
  notionals: any
}

interface WorkspaceContainerDispatchProps {
  executeTrade: (direction: Direction) => void
  onComponentMount: (id: string) => void
  onPopoutClick: (region: any, component: any, openFin:any) => any
  undockTile: (openFin: any, title: string) => any
  displayCurrencyChart: (openFin: any, symbol: string) => any
  onNotificationDismissedClick: (symbol: string) => any
}

type WorkspaceContainerProps =
  WorkspaceContainerOwnProps
  & WorkspaceContainerStateProps
  & WorkspaceContainerDispatchProps

const NOTIONAL = 1000000

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, {}> {

  static contextTypes = {
    openFin: React.PropTypes.object,
  }

  render() {
    const openFin = this.context.openFin
    const items = this.props.spotTiles && _.values(this.props.spotTiles)

    return <div className="shell__workspace">
      <div className="workspace-region">
        {this.renderItems(items, openFin)}
      </div>
    </div>
  }

  renderItems(items, openFin) {
    if (!items.length) {
      return <div className="workspace-region__icon--loading"><i className="fa fa-5x fa-cog fa-spin"/></div>
    }

    return _.map(items, (item: any) => {
      const currencyPair: CurrencyPair = this.props.referenceService[item.symbol].currencyPair
      const title = `${currencyPair.base} / ${currencyPair.terms}`
      const tileProps = {
        title,
        currencyPair,
        canPopout:Environment.isRunningInIE(),
        currencyChartIsOpening: item.currencyChartIsOpening,
        currentSpotPrice: item,
        executionConnected: true,
        hasNotification: !!item.notification,
        isTradable: true, // or false if prace is stale
        isRunningInOpenFin: !!openFin,
        isTradeExecutionInFlight: item.isTradeExecutionInFlight,
        notification: item.notification,
        notional: this.props.notionals[currencyPair.symbol] || NOTIONAL,
        priceStale: item.priceStale,
        pricingConnected: true,
        executeTrade: this.props.executeTrade,
        onComponentMount: this.props.onComponentMount,
        undockTile: this.props.undockTile(openFin, title),
        onPopoutClick: () => {},
        onNotificationDismissedClick: this.props.onNotificationDismissedClick(item.symbol),
        displayCurrencyChart: this.props.displayCurrencyChart(openFin, item.symbol),
      }

      tileProps.onPopoutClick = this.props.onPopoutClick(item.symbol, tileProps, openFin)

      return (
        <RegionWrapper key={item.symbol} region={item.symbol}>
          <div className="workspace-region__item" >
            <SpotTile
              {...tileProps}
            />
          </div>
        </RegionWrapper>
      )
    }).concat(_.times(6, i => <div key={i} className="workspace-region__spacer"/>)) // add empty items at the end so tiles lay out nicely
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  executeTrade: (payload) => {
    dispatch(executeTrade(payload))
  },
  onComponentMount: (id, tileProps) => {
    dispatch(onComponentMount(spotTileRegion(id, tileProps)))
  },
  onPopoutClick: (id, tileProps, openFin) => {
    return () => {
      dispatch(onPopoutClick(spotTileRegion(id, tileProps), openFin))
    }
  },
  undockTile: (openFin, tileName) => {
    return () => {
      dispatch(undockTile({ openFin, tileName }))
    }
  },
  displayCurrencyChart: (openFin, symbol) => {
    return () => {
      dispatch(displayCurrencyChart({ openFin, symbol }))
    }
  },
  onNotificationDismissedClick: (symbol) => {
    return () => {
      dispatch(dismissNotification({ symbol }))
    }
  },
})

const spotTileRegion = (id, tileProps) => ({
  id,
  isTearedOff: false,
  container: <SpotTile {...tileProps} />,
  settings: spotRegionSettings(id),
})

function mapStateToProps({ spotTiles, compositeStatusService, referenceService, notionals }) {
  const isConnected = compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected || false

  return { spotTiles, isConnected, referenceService, notionals }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceContainer)
