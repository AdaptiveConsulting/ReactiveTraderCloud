import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { TradeStatus } from '../../services/model/index'

class TradeNotification extends React.Component<any, {}> {

  static contextTypes = {
    openFin: React.PropTypes.object,
  }

  public componentWillReceiveProps(newProps) {
    if (this.context.openFin && this.props.trades && Object.keys(this.props.trades).length) {
      this.showOpenFinNotificationsForNewTrades(this.props.trades, newProps.trades)
    }
    return newProps
  }

  public showOpenFinNotificationsForNewTrades(previousTrades, payloadTrades) {
    _.forEach(payloadTrades, (trade) => {
      // ignore existing trades, unless it was pending
      if (previousTrades[trade.tradeId] && previousTrades[trade.tradeId].status !== TradeStatus.Pending) return

      // display a notification if the trade has a final status (Done or Rejected)
      if ((trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected)) {
        this.context.openFin.openTradeNotification(trade)
      }
    })
  }

  public render() {
    return null
  }
}

const mapStateToProps = ({ blotterService }) => {
  return { blotterService, trades: blotterService.trades }
}

const TradeNotificationContainer = connect(mapStateToProps)(TradeNotification)

export default TradeNotificationContainer
