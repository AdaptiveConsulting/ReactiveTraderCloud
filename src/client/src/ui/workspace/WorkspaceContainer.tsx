import * as _ from 'lodash'
import * as React from 'react'
import './workspace.scss'
import { connect } from 'react-redux'
import SpotTile from '../spotTile/SpotTile'
import CurrencyPair from '../../services/model/currencyPair'
import { Direction } from '../../services/model/index'
import { bindActionCreators, Dispatch } from 'redux'
import { executeTrade } from '../../redux/execution/executionOperations'

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
}

type WorkspaceContainerProps = WorkspaceContainerOwnProps & WorkspaceContainerStateProps & WorkspaceContainerDispatchProps

const NOTIONAL = 1000000

export class WorkspaceContainer extends React.Component<WorkspaceContainerProps, {}> {
  render() {
    const items = _.values(this.props.pricingService)

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
            notification={null}
            notional={this.props.notionals[currencyPair.symbol] || NOTIONAL}
            priceStale={false}
            pricingConnected={true}
            title={title}
            executeTrade={this.props.executeTrade}
          />
        </div>
      )
    }).concat(_.times(6, i => <div key={i} className="workspace-region__spacer"/>)) // add empty items at the end so tiles lay out nicely
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators(
  {
    executeTrade,
  },
  dispatch)

function mapStateToProps({ pricingService, compositeStatusService, referenceService, notionals }) {
  const isConnected =  compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected || false
  return { pricingService, isConnected, referenceService, notionals }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceContainer)
