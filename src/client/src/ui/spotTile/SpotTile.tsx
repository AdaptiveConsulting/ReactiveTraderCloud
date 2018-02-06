import * as React from 'react'
import * as classnames from 'classnames'
import { TradeNotification, SpotTileControls } from './'
import * as moment from 'moment'
import './SpotTileStyles.scss'
import NotionalContainer from './notional/NotionalContainer'
import { NotificationType } from '../../types'
import { CurrencyPair } from '../../types/currencyPair'
import PriceControlsView from './priceControlsView/PriceControlsView'

const SPOT_DATE_FORMAT = 'DD MMM'

interface Notification {
  hasError: any
  notificationType: NotificationType
}

export interface CurrentSpotPrice {
  ask: number
  bid: number
  priceMovementType: string
  mid: number
  valueDate: number
  symbol: string
}

export interface SpotTileProps {
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
    const { hasNotification, notification } = this.props
    return (
      <div className={this.getSpotContainerClassName()}>
        <div className="spot-tile__container">
          {this.createSpotTileControls()}
          {!hasNotification ? this.getSpotTileContent() : this.createNotificationView(notification)}
        </div>
      </div>
    )
  }

  getSpotContainerClassName() {
    const { executionConnected, hasNotification, isTradeExecutionInFlight, notification, priceStale } = this.props
    const className = classnames('spot-tile', {
      'spot-tile--stale': (/*!pricingConnected ||*/ priceStale) &&
      !(hasNotification && notification.notificationType === NotificationType.Trade),
      'spot-tile--readonly': !executionConnected,
      'spot-tile--executing': isTradeExecutionInFlight,
      'spot-tile--error': hasNotification && notification.hasError,
    })

    return className
  }

  createSpotTileControls() {
    const { onPopoutClick, undockTile, displayCurrencyChart, isRunningInOpenFin, currencyChartIsOpening } = this.props
    const spotTileControlsProps = {
      onPopoutClick,
      undockTile,
      displayCurrencyChart,
      isRunningInOpenFin,
      currencyChartIsOpening
    }
    return (
      <SpotTileControls { ...spotTileControlsProps }/>
    )
  }

  createPriceComponents() {
    const { currencyPair, title, currentSpotPrice, executeTrade } = this.props
    if (currentSpotPrice === null) return null

    return (
      <PriceControlsView currencyPair={currencyPair}
                         title={title}
                         currentSpotPrice={currentSpotPrice}
                         executeTrade={executeTrade}/>
    )
  }

  getSpotTileContent() {
    const { hasNotification, currentSpotPrice, currencyPair } = this.props
    const notionalInputClass = classnames('spot-tile__notional', { hide: hasNotification })
    const spotDateClass = classnames('spot-tile__delivery', { hide: hasNotification })
    const formattedDate = currentSpotPrice ? moment(currentSpotPrice.valueDate).format(SPOT_DATE_FORMAT) : ''

    return (<div>
      <span className="spot-tile__execution-label">Executing</span>
      {this.createPriceComponents()}
      <NotionalContainer
        className={notionalInputClass}
        currencyPair={currencyPair}
      />
      <div className={spotDateClass}>
        <span className="spot-tile__tenor">SP</span>
        <span className="spot-tile__delivery-date">. {formattedDate}</span>
      </div>
    </div>)
  }

  createNotificationView(notification: any) {
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
