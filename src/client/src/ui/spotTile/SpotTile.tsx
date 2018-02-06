import * as React from 'react'
import * as classnames from 'classnames'
import { PriceButton, PriceMovementIndicator, TradeNotification } from './'
import * as moment from 'moment'
import './SpotTileStyles.scss'
import NotionalContainer from './notional/NotionalContainer'
import { Direction, NotificationType } from '../../types'
import { Rate } from '../../types/rate'
import { CurrencyPair } from '../../types/currencyPair'

const SPOT_DATE_FORMAT = 'DD MMM'

interface Notification {
  hasError: any
  notificationType: NotificationType
}

interface CurrentSpotPrice {
  ask: any
  bid: any
  priceMovementType: string
  mid: any
  valueDate: number
  symbol: string
}

export interface SpotTileProps {
  canPopout: boolean
  currencyChartIsOpening: boolean
  currencyPair: CurrencyPair
  currentSpotPrice: CurrentSpotPrice
  executionConnected: boolean
  hasNotification: boolean
  isRunningInOpenFin: boolean
  isTradeExecutionInFlight: boolean
  notification: Notification
  notional: number
  priceStale: boolean
  title: string
  executeTrade: (direction: any) => void
  onComponentMount: any
  onPopoutClick: () => void
  undockTile: () => void
  displayCurrencyChart: () => void
  onNotificationDismissedClick: () => void
}

export default class SpotTile extends React.Component<SpotTileProps, {}> {

  componentDidMount() {
    const currencyPair = this.props.currencyPair.symbol
    this.props.onComponentMount(currencyPair)
  }

  render() {
    const {
      canPopout, currencyChartIsOpening, currentSpotPrice, currencyPair, executionConnected,
      hasNotification, isRunningInOpenFin, isTradeExecutionInFlight, notification, priceStale, title,
      onPopoutClick, undockTile, displayCurrencyChart,
    } = this.props

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
      'spot-tile--stale': (/*!pricingConnected ||*/ priceStale) &&
      !(hasNotification && notification.notificationType === NotificationType.Trade),
      'spot-tile--readonly': !executionConnected,
      'spot-tile--executing': isTradeExecutionInFlight,
      'spot-tile--error': hasNotification && notification.hasError,
    })

    const newWindowClassName = classnames('popout__controls  glyphicon glyphicon-new-window', {
      'spot-tile__icon--tearoff': !canPopout,
      'spot-tile__icon--hidden': canPopout,
    })
    const spotTileContent = (
      <div>
        <span className="spot-tile__execution-label">Executing</span>
        {priceComponents}
        <NotionalContainer
          className={notionalInputClass}
          currencyPair={currencyPair}
        />
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
               onClick={() => displayCurrencyChart()}/>
            <i className={newWindowClassName}
               onClick={() => onPopoutClick()}/>
            <i className="popout__undock spot-tile__icon--undock glyphicon glyphicon-log-out"
               onClick={() => undockTile()}/>
          </div>
          {!hasNotification ? spotTileContent : generatedNotification}
        </div>
      </div>
    )
  }

  createPriceComponents(title: string, currentSpotPrice: CurrentSpotPrice, hide: boolean) {
    if (currentSpotPrice === null) return null

    const pricingContainerClass = classnames({ hide })
    const { currencyPair } = this.props

    return (
      <div className={pricingContainerClass}>
        <span className="spot-tile__symbol">{title}</span>
        <PriceButton
          className="spot-tile__price spot-tile__price--bid"
          direction={Direction.Sell}
          onExecute={() => this.props.executionConnected && !this.props.isTradeExecutionInFlight && this.props.executeTrade(createTradeRequest(Direction.Sell, this.props.currencyPair.symbol, this.props.currentSpotPrice.bid, this.props.notional, this.props.currencyPair.base, this.props))}
          rate={toRate(currentSpotPrice.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)}
          currencyPair={this.props.currencyPair}/>
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={currentSpotPrice.priceMovementType}
            spread={getSpread(currentSpotPrice.bid, currentSpotPrice.ask, currencyPair.pipsPosition, currencyPair.ratePrecision)}/>
        </div>
        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={Direction.Buy}
          onExecute={() => this.props.executionConnected && !this.props.isTradeExecutionInFlight && this.props.executeTrade(createTradeRequest(Direction.Buy, this.props.currencyPair.symbol, this.props.currentSpotPrice.ask, this.props.notional, this.props.currencyPair.base, this.props))}
          rate={toRate(currentSpotPrice.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)}
          currencyPair={this.props.currencyPair}/>
      </div>
    )
  }

  createNotification(notification: any) {
    if (notification.notificationType === NotificationType.Trade) {
      return (
        <TradeNotification
          className="spot-tile__trade-summary"
          notification={notification}
          onDismissedClicked={() => this.props.onNotificationDismissedClick()}/>
      )
    } else if (notification.notificationType === NotificationType.Text) {
      return (
        <div className="spot-tile__notification-message">{notification.message}</div>
      )
    } else {
      throw new Error(`Unknown notification type ${notification.notificationType}`)
    }
  }
}

function toRate(rawRate: number = 0, ratePrecision: number = 0, pipPrecision: number = 0): Rate {
  const rateString = rawRate.toFixed(ratePrecision)
  const priceParts = rateString.split('.')
  const wholeNumber = priceParts[0]
  const fractions = priceParts[1]

  return {
    rawRate,
    ratePrecision,
    pipPrecision,
    bigFigure: Number(wholeNumber + '.' + fractions.substring(0, pipPrecision - 2)),
    pips: Number(fractions.substring(pipPrecision - 2, pipPrecision)),
    pipFraction: Number(fractions.substring(pipPrecision, pipPrecision + 1)),
  }
}

function getSpread(bid: number, ask: number, pipsPosition: number, ratePrecision: number) {
  const spread = (ask - bid) * Math.pow(10, pipsPosition)
  const toFixedPrecision = spread.toFixed(ratePrecision - pipsPosition)
  return {
    value: Number(toFixedPrecision),
    formattedValue: toFixedPrecision,
  }
}


const createTradeRequest = (direction: Direction, currencyPair: string, spotRate: any, notional: number, currencyBase: string, props: any) => {
  return {
    CurrencyPair: currencyPair,
    SpotRate: spotRate.rawRate,
    Direction: direction,
    Notional: notional,
    DealtCurrency: currencyBase,
  }
}

