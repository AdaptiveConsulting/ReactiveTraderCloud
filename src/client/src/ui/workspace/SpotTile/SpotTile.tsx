import React from 'react'
import classnames from 'classnames'
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './'
import moment from 'moment/src/moment'
import './spotTile.scss'

const SPOT_DATE_FORMAT = 'DD MMM'

// TODO: Move these to types and actions
function replaceWithAction(a: any, b: any): void {
  return
}
type Direction = 'Buy' | 'Sell'
type NotificationType = 'Trade' | 'Sell'
interface CurrentSpotPrice {
  ask: any
  bid: any
  priceMovementType: number
  spread: number
  valueDate: number
}

export interface SpotTileProps {
  canPopout: boolean
  currencyChartIsOpening: boolean
  currencyPair: {
    symbol: string
    base: string
  }
  currentSpotPrice: CurrentSpotPrice
  executionConnected: boolean
  hasNotification: boolean
  isRunningInOpenFin: boolean
  isTradeExecutionInFlight: boolean
  maxNotional: number
  notification: {
    notificationType: NotificationType
  }
  notional: number
  priceStale: boolean
  pricingConnected: boolean
  title: string
}

export default class SpotTile extends React.Component<SpotTileProps, {}> {
  props: SpotTileProps

  render() {
    const props = this.props
    const { canPopout, currencyChartIsOpening, currentSpotPrice, hasNotification, notification, title } = props

    const notionalInputClass = classnames('spot-tile__notional', { hide: hasNotification })
    const spotDateClass = classnames('spot-tile__delivery', { hide: hasNotification })
    const generatedNotification = hasNotification ? this.createNotification(notification) : null
    const priceComponents = this.createPriceComponents(title, currentSpotPrice, !hasNotification)
    const showChartIQIcon = props.isRunningInOpenFin

    const chartIQIconClassName = classnames({
      'spot-tile__icon--hidden': !showChartIQIcon,
      'glyphicon glyphicon-refresh spot-tile__icon--rotate': currencyChartIsOpening,
      'spot-tile__icon--chart glyphicon glyphicon-stats': !currencyChartIsOpening,
    })

    const formattedDate = currentSpotPrice ? moment(currentSpotPrice.valueDate).format(SPOT_DATE_FORMAT) : ''
    const className = classnames('spot-tile', {
      'spot-tile--stale': (!props.pricingConnected || props.priceStale) && !(hasNotification && notification.notificationType === 'Trade'),
      'spot-tile--readonly': !props.executionConnected,
      'spot-tile--executing': props.isTradeExecutionInFlight,
      'spot-tile--error': hasNotification && notification.error,
    })

    const newWindowClassName = classnames('popout__controls  glyphicon glyphicon-new-window', {
      'spot-tile__icon--tearoff': !canPopout,
      'spot-tile__icon--hidden': canPopout,
    })
    const spotTileContent = (
      <div>
        <span className="spot-tile__execution-label">Executing</span>
        {priceComponents}
        <NotionalInput
          className={notionalInputClass}
          notional={props.notional}
          onChange={notional => replaceWithAction('notionalChanged', { notional })}
          maxValue={props.maxNotional}
          currencyPair={props.currencyPair}/>
        <div className={spotDateClass}>
          <span className="spot-tile__tenor">SP</span>
          <span className="spot-tile__delivery-date">. {formattedDate}</span>
        </div>
      </div>
    )
    return (
      <div className={className}>
        <div className="spot-tile__container">
          <div className="spot-tile__controls">
            <i className={chartIQIconClassName}
               onClick={() => this.displayCurrencyChart()}/>
            <i className={newWindowClassName}
               onClick={() => replaceWithAction('popOutTile', {})}/>
            <i className="popout__undock spot-tile__icon--undock glyphicon glyphicon-log-out"
               onClick={() => replaceWithAction('undockTile', {})}/>
          </div>
          {!hasNotification ? spotTileContent : generatedNotification}
        </div>
      </div>
    )
  }

  displayCurrencyChart() {
    replaceWithAction('displayCurrencyChart', {})
  }

  createPriceComponents(title: string, currentSpotPrice: CurrentSpotPrice, hide: boolean) {
    if (currentSpotPrice === null) return null

    const pricingContainerClass = classnames({ hide })

    return (
      <div className={pricingContainerClass}>
        <span className="spot-tile__symbol">{title}</span>
        <PriceButton
          className="spot-tile__price spot-tile__price--bid"
          direction={'Sell'}
          onExecute={() => this.executeTrade('Sell')}
          rate={currentSpotPrice.bid}/>
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={currentSpotPrice.priceMovementType}
            spread={currentSpotPrice.spread}/>
        </div>
        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={'Buy'}
          onExecute={() => this.executeTrade('Buy')}
          rate={currentSpotPrice.ask}/>
      </div>
    )
  }

  executeTrade(direction: Direction) {
    if (this.props.executionConnected) {
      replaceWithAction('executeTrade', { direction })
    }
  }

  createNotification(notification) {
    if (notification.notificationType === 'Trade') {
      return (
        <TradeNotification
          className="spot-tile__trade-summary"
          tradeExecutionNotification={notification}
          onDismissedClicked={e => replaceWithAction('tradeNotificationDismissed', {})}/>
      )
    } else if (notification.notificationType === 'Text') {
      return (
        <div className="spot-tile__notification-message">{notification.message}</div>
      )
    } else {
      throw new Error(`Unknown notification type ${notification.notificationType}`)
    }
  }
}
