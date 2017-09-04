import * as React from 'react'
import * as classnames from 'classnames'
import { PriceButton, PriceMovementIndicator, TradeNotification } from './'
import * as moment from 'moment'
import './SpotTileStyles.scss'
import NotionalContainer from './notional/NotionalContainer'
import { Direction, NotificationType } from '../../types'

const SPOT_DATE_FORMAT = 'DD MMM'

interface Notification {
  hasError: any
  notificationType: NotificationType
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

export interface SpotTileProps {
  canPopout: boolean
  currencyChartIsOpening: boolean
  currencyPair: any
  currentSpotPrice: CurrentSpotPrice
  executionConnected: boolean
  hasNotification: boolean
  isRunningInOpenFin: boolean
  isTradeExecutionInFlight: boolean
  notification: Notification
  notional: number
  priceStale: boolean
  pricingConnected: boolean
  title: string
  executeTrade: (direction: any) => void
  onComponentMount: (id: string) => void
  onPopoutClick: () => void
  undockTile: () => void
  displayCurrencyChart: () => void
  onNotificationDismissedClick: () => void,
  isTradable: boolean,
}

export default class SpotTile extends React.Component<SpotTileProps, {}> {
  props: SpotTileProps

  componentDidMount() {
    const currencyPair = this.props.currencyPair.symbol
    this.props.onComponentMount(currencyPair)
  }

  // TODO: this workaround prevents unnecessary rerendering of spottile and it's subcomponents
  // shape of data should be changed to allow shallow checks
  shouldComponentUpdate(nextProps) {
    // shape of what properties to check including nested props
    // not true values are skipped so no need to include false entries
    // UNDEFINED values will cause the whole thing to always trigger update, so this must be avoided
    const comparisonTemplate = {
      // currencyChartIsOpening: false,
      updateType: true,
      currentSpotPrice: {
        ask: {
          bigFigure: true,
          pipFraction: true,
          pipPrecision: true,
          pips: true,
          ratePrecision: true,
          rawRate: true,
        },
        bid: {
          bigFigure: true,
          pipFraction: true,
          pipPrecision: true,
          pips: true,
          ratePrecision: true,
          rawRate: true,
        },
        priceMovementType: true,
        spread: {
          value: true,
        },
        // symbol: false,
        // valueDate: false,
      },
      currencyChartIsOpening: true,
      // creationTimestamp: false,
      isTradable: true,
      executionConnected: true,
      // isRunningInOpenFin: false,
      priceStale: true,
      pricingConnected: true,
      isTradeExecutionInFlight: true,
      hasNotification: true,
    }

    // workaround to reduce number of redraws for current complex shape of data
    return !objetcsDeepEqualByTemplate(this.props, nextProps, comparisonTemplate)
  }

  render() {
    const {
      canPopout, currencyChartIsOpening, currentSpotPrice, currencyPair, executionConnected,
      hasNotification, isRunningInOpenFin, isTradeExecutionInFlight, notification, priceStale, pricingConnected, title,
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
      'spot-tile--stale': (!pricingConnected || priceStale) &&
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

    return (
      <div className={pricingContainerClass}>
        <span className="spot-tile__symbol">{title}</span>
        <PriceButton
          className="spot-tile__price spot-tile__price--bid"
          direction={Direction.Sell}
          onExecute={() => !this.props.isTradeExecutionInFlight && this.props.executeTrade(createTradeRequest(Direction.Sell, this.props.currencyPair.symbol, this.props.currentSpotPrice.bid, this.props.notional, this.props.currencyPair.base, this.props))}
          rate={currentSpotPrice.bid}/>
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={currentSpotPrice.priceMovementType}
            spread={currentSpotPrice.spread}/>
        </div>
        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={Direction.Buy}
          onExecute={() => !this.props.isTradeExecutionInFlight && this.props.executeTrade(createTradeRequest(Direction.Buy, this.props.currencyPair.symbol, this.props.currentSpotPrice.ask, this.props.notional, this.props.currencyPair.base, this.props))}
          rate={currentSpotPrice.ask}/>
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

const createTradeRequest = (direction: Direction, currencyPair: string, spotRate: any, notional: number, currencyBase: string, props: any) => {
  return {
    CurrencyPair: currencyPair,
    SpotRate: spotRate.rawRate,
    Direction: direction,
    Notional: notional,
    DealtCurrency: currencyBase,
  }
}


// deep comparison of 2 objects using a 3rd object as a template of which properties to compare
function objetcsDeepEqualByTemplate(objectA, objectB, comparisonTemplate) {
  if (!objectA || !objectB) return false

  let areDifferent = false
  Object.keys(comparisonTemplate).some((key) => {
    if (typeof comparisonTemplate[key] === 'object') {
      areDifferent = !objetcsDeepEqualByTemplate(objectA[key], objectB[key], comparisonTemplate[key])
      return areDifferent
    } else if (comparisonTemplate[key] === true) {
      areDifferent = objectA[key] !== objectB[key]
      return areDifferent
    } else {
      return false
    }
  })

  return !areDifferent
}
