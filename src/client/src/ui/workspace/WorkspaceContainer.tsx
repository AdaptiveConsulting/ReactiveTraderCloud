import * as _ from 'lodash'
import * as React from 'react'
import './workspace.scss'
import { connect } from 'react-redux'
import SpotTile from '../spotTile/SpotTile';
import CurrencyPair from '../../services/model/currencyPair';

export interface WorkspaceContainerProps {
  children: any
  pricingService: any
  referenceService: any
  executionService?: any
  isConnected: boolean
  compositeStatusService: any
}
const MAX_NOTIONAL_VALUE = 1000000000
const NOTIONAL = 1000000

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, {}> {
  render() {
    const items = Object.values(this.props.pricingService)

    return <div className="shell__workspace">
        <div className="workspace-region">
          { this.renderItems(items) }
        </div>
      </div>
  }

  renderItems(items) {
    if (!items.length) {
      return <div className="workspace-region__icon--loading"><i className="fa fa-5x fa-cog fa-spin"/></div>
    }

    return _.map(items, (item: any) => {
      const currencyPair: CurrencyPair = this.props.referenceService[item.symbol].currencyPair
      const title = `${currencyPair.base} / ${currencyPair.terms}`
      return (
        <div className="workspace-region__item" key={item._symbol}>
          <SpotTile
            canPopout={false}
            currencyChartIsOpening={false}
            currencyPair={this.props.referenceService[item.symbol]}
            currentSpotPrice={item}
            executionConnected={false}
            hasNotification={false}
            isRunningInOpenFin={false}
            isTradeExecutionInFlight={false}
            maxNotional={MAX_NOTIONAL_VALUE}
            notification={null}
            notional={NOTIONAL}
            priceStale={false}
            pricingConnected={true}
            title={title}/>
        </div>
      )
    }).concat(_.times(6, i => <div key={i} className="workspace-region__spacer"/>)) // add empty items at the end so tiles lay out nicely
  }
}

function mapStateToProps({ pricingService, compositeStatusService, referenceService }) {
  const isConnected =  compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected || false
  return { pricingService, isConnected, referenceService }
}

export default connect(mapStateToProps)(WorkspaceContainer)
