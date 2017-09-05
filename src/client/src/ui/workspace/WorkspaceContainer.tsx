import * as _ from 'lodash'
import * as React from 'react'
import './workspace.scss'
import { connect } from 'react-redux'
import SpotTile from '../spotTile/SpotTile'
import CurrencyPair from '../../services/model/currencyPair'
import { Direction } from '../../services/model/index'
import { Dispatch } from 'redux'
import { executeTrade, undockTile, displayCurrencyChart, spotRegionSettings } from '../../redux/spotTile/spotTileOperations'
// @todo: move (and possiblly rename) the region  related methods to RegionOperations
import { onComponentMount, onPopoutClick } from '../blotter/blotterOperations'
import { RegionWrapper } from '../../redux/regions'
import { Environment } from '../../system'


interface WorkspaceContainerOwnProps {

}

interface WorkspaceContainerStateProps {
  children: any
  pricingService: any
  referenceService: any
  executionService?: any
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
    const items = _.values(this.props.pricingService)

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
      let tileProps = {
        canPopout:Environment.isRunningInIE,
        currencyChartIsOpening: false,
        currencyPair: this.props.referenceService[item.symbol],
        currentSpotPrice: item,
        executionConnected: true,
        hasNotification: false,
        isRunningInOpenFin: !!openFin,
        isTradeExecutionInFlight: false,
        notification: null,
        notional: this.props.notionals[currencyPair.symbol] || NOTIONAL,
        priceStale: false,
        pricingConnected: true,
        title: title,
        executeTrade: this.props.executeTrade,
        onComponentMount: this.props.onComponentMount,
        undockTile: this.props.undockTile(openFin, title),
        onPopoutClick: () => {},
        displayCurrencyChart: this.props.displayCurrencyChart(openFin, item.symbol)
      }

      tileProps.onPopoutClick = this.props.onPopoutClick(item.symbol, tileProps, openFin)

      return (
        <RegionWrapper key={item._symbol} region={item._symbol}>
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

const mapDispatchToProps = (dispatch: Dispatch<any>,) => ({
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
      dispatch(undockTile({openFin, tileName}) )
    }
  },
  displayCurrencyChart: (openFin, symbol) => {
    return () => {
      dispatch(displayCurrencyChart({openFin, symbol}))
    }
  }

})

const spotTileRegion = (id, tileProps) => (
  {
    id,
    isTearedOff: false,
    container: <SpotTile {...tileProps} />,
    settings: spotRegionSettings(id)
  }
)

function mapStateToProps({pricingService, compositeStatusService, referenceService, notionals}) {
  const isConnected = compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected || false
  return {pricingService, isConnected, referenceService, notionals}
}


export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceContainer)
