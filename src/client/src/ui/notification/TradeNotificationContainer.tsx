import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { CurrencyPairState } from '../../operations/currencyPairs'
import { Trade, TradeStatus } from '../../types'
import { Trades } from '../blotter'
import { BlotterState } from '../blotter/reducer'

interface TradeNotificationContainerProps {
  blotterService: BlotterState
  currencyPairs: CurrencyPairState
  trades: Trades
}

class TradeNotification extends React.Component<TradeNotificationContainerProps, {}> {
  static contextTypes = {
    openFin: PropTypes.object
  }

  public componentWillReceiveProps(newProps: TradeNotificationContainerProps) {
    const { trades } = this.props
    if (this.context.openFin && trades && Object.keys(trades).length) {
      this.showOpenFinNotificationsForNewTrades(trades, newProps.trades)
    }
    return newProps
  }

  public showOpenFinNotificationsForNewTrades(previousTrades: Trades, payloadTrades: Trades) {
    _.forEach(payloadTrades, (trade: Trade) => {
      // ignore existing trades, unless it was pending
      if (previousTrades[trade.tradeId] && previousTrades[trade.tradeId].status !== TradeStatus.Pending) {
        return
      }

      // display a notification if the trade has a final status (Done or Rejected)
      if (trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected) {
        this.context.openFin.openTradeNotification(trade, this.props.currencyPairs[trade.symbol])
      }
    })
  }

  public render() {
    return null
  }
}

const mapStateToProps = ({ blotterService, currencyPairs }: GlobalState) => ({
  blotterService,
  currencyPairs,
  trades: blotterService.trades
})

const TradeNotificationContainer = connect(mapStateToProps)(TradeNotification)

export default TradeNotificationContainer
