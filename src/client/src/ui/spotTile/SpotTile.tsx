import * as React from 'react'
import * as classnames from 'classnames'
import { CurrencyPair, PriceMovementIndicator, PriceButton, NotionalInput,
         TradeNotification } from './'
import * as moment from 'moment'
import './spotTile.scss'

const SPOT_DATE_FORMAT = 'DD MMM'

// TODO: Move these to types and actions
function replaceWithAction(a: any, b: any): void {
  return
}
interface Notification {
  error: any
  notificationType: 'Trade' | 'Sell' | string
}
interface CurrentSpotPrice {
  ask: any
  bid: any
  priceMovementType: string
  spread: {
    formattedValue: string,
  }
  valueDate: number
}
interface Direction {
  name: 'Buy' | 'Sell' | string
}
const directionBuy = { name: 'Buy' }
const directionSell = { name: 'Sell' }

export interface SpotTileProps {
  canPopout: boolean
  currencyChartIsOpening: boolean
  currencyPair: CurrencyPair
  currentSpotPrice: CurrentSpotPrice
  executionConnected: boolean
  hasNotification: boolean
  isRunningInOpenFin: boolean
  isTradeExecutionInFlight: boolean
  maxNotional: number
  notification: Notification
  notional: number
  priceStale: boolean
  pricingConnected: boolean
  title: string
}

export default class SpotTile extends React.Component<SpotTileProps, {}> {
  props: SpotTileProps

  render() {
    const { canPopout, currencyChartIsOpening, currentSpotPrice, currencyPair, executionConnected,
      hasNotification, isRunningInOpenFin, isTradeExecutionInFlight, maxNotional, notification,
      notional, priceStale, pricingConnected, title } = this.props

    const notionalInputClass = classnames('spot-tile__notional', { hide: hasNotification })
    const spotDateClass = classnames('spot-tile__delivery', { hide: hasNotification })
    const generatedNotification = hasNotification ? this.createNotification(notification) : null
    const priceComponents = this.createPriceComponents(title, currentSpotPrice, hasNotification)
    const showChartIQIcon = isRunningInOpenFin

    const chartIQIconClassName = classnames({
      'spot-tile__icon--hidden': !showChartIQIcon,
      'glyphicon glyphicon-refresh spot-tile__icon--rotate': currencyChartIsOpening,
      'spot-tile__icon--chart glyphicon glyphicon-stats': !currencyChartIsOpening,
    })

    const formattedDate = currentSpotPrice ?
      moment(currentSpotPrice.valueDate).format(SPOT_DATE_FORMAT)
      : ''
    const className = classnames('spot-tile', {
      'spot-tile--stale': (!pricingConnected || priceStale) &&
      !(hasNotification && notification.notificationType === 'Trade'),
      'spot-tile--readonly': !executionConnected,
      'spot-tile--executing': isTradeExecutionInFlight,
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
          notional={notional}
          onChange={notional => replaceWithAction('notionalChanged', { notional })}
          maxValue={maxNotional}
          currencyPair={currencyPair} />
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
              onClick={() => this.displayCurrencyChart()} />
            <i className={newWindowClassName}
              onClick={() => replaceWithAction('popOutTile', {})} />
            <i className="popout__undock spot-tile__icon--undock glyphicon glyphicon-log-out"
              onClick={() => replaceWithAction('undockTile', {})} />
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
          direction={directionSell}
          onExecute={() => this.executeTrade(directionSell)}
          rate={currentSpotPrice.bid} />
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={currentSpotPrice.priceMovementType}
            spread={currentSpotPrice.spread} />
        </div>
        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={directionBuy}
          onExecute={() => this.executeTrade(directionBuy)}
          rate={currentSpotPrice.ask} />
      </div>
    )
  }

  executeTrade(direction: Direction) {
    if (this.props.executionConnected) {
      replaceWithAction('executeTrade', { direction })
    }
  }

  createNotification(notification: any) {
    if (notification.notificationType === 'Trade') {
      return (
        <TradeNotification
          className="spot-tile__trade-summary"
          notification={notification}
          onDismissedClicked={() => replaceWithAction('tradeNotificationDismissed', {})} />
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

// to be used in a container
// const mapStateToProps = (state:SpotTileProps): any => {
//   return {
//     canPopout: state.canPopout,
//     currencyChartIsOpening: state.currencyChartIsOpening,
//     currencyPair: state.currencyPair,
//     currentSpotPrice: state.currentSpotPrice,
//     executionConnected: state.executionConnected,
//     hasNotification: state.hasNotification,
//     isRunningInOpenFin: state.isRunningInOpenFin,
//     isTradeExecutionInFlight: state.isTradeExecutionInFlight,
//     maxNotional: state.maxNotional,
//     notification: state.notification,
//     notional: state.notional,
//     priceStale: state.priceStale,
//     pricingConnected: state.pricingConnected,
//     title: state.title,
//   }
// }
