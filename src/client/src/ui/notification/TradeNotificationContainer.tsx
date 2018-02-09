import * as _ from 'lodash'
import * as React from 'react'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CurrencyPair, Trade, TradeStatus } from '../../types'

interface TradeNotificationContainerProps {
  blotterService
  currencyPairs: CurrencyPair[]
  trades: Trade[]
}

class TradeNotification extends React.Component<TradeNotificationContainerProps, {}> {

  static contextTypes = {
    openFin: PropTypes.object
  }

  public componentWillReceiveProps(newProps) {
    if (this.context.openFin && this.props.trades && Object.keys(this.props.trades).length) {
      this.showOpenFinNotificationsForNewTrades(this.props.trades, newProps.trades)
    }
    return newProps
  }

  public showOpenFinNotificationsForNewTrades(previousTrades, payloadTrades) {
    _.forEach(payloadTrades, (trade:Trade) => {
      // ignore existing trades, unless it was pending
      if (previousTrades[trade.tradeId] && previousTrades[trade.tradeId].status !== TradeStatus.Pending) return

      // display a notification if the trade has a final status (Done or Rejected)
      if ((trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected)) {
        this.context.openFin.openTradeNotification(trade, this.props.currencyPairs[trade.symbol])
      }
    })
  }

  public render() {
    return null
  }
}

const mapStateToProps = (state: any) => {
  const { blotterService, currencyPairs } = state
  return {
    blotterService,
    currencyPairs,
    trades: blotterService.trades
  }
}

const TradeNotificationContainer = connect(mapStateToProps)(TradeNotification)

export default TradeNotificationContainer
