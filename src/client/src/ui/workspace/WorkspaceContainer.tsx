import * as _ from 'lodash'
import * as React from 'react'
import './workspace.scss'
import { connect } from 'react-redux'
// import { SpotTile } from '../spotTile'

export interface WorkspaceContainerProps {
  children: any
  pricingService: any
  executionService?: any
  isConnected: boolean
  compositeStatusService: any
}

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
      return (
        <div className="workspace-region__item" key={item._symbol}>
          {item.ask.rawRate}
        </div>
      )
    }).concat(_.times(6, i => <div key={i} className="workspace-region__spacer"/>)) // add empty items at the end so tiles lay out nicely
  }
}

function mapStateToProps({ pricingService, compositeStatusService }) {
  const isConnected =  compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected || false
  return { pricingService, isConnected }
}

export default connect(mapStateToProps)(WorkspaceContainer)
