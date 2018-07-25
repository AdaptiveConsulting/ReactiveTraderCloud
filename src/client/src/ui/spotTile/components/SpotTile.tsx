import * as classnames from 'classnames'
import * as React from 'react'
import { CurrencyPair, Direction, Notification, NotificationType } from 'rt-types'
import { SpotTileControls, TradeNotification } from '../components/'
import { spotDateFormatter } from '../model/dateUtils'
import { SpotTileData } from '../model/spotTileData'
import NotionalContainer from './notional/NotionalContainer'
import PriceControlsView from './priceControlsView/PriceControlsView'
import { buildNotification } from './tradeNotification/notificationUtils'
const stalePriceErrorMessage = 'Pricing is unavailable'
export interface SpotTileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionConnected: boolean
  pricingConnected: boolean
  isRunningOnDesktop: boolean
  executeTrade: (direction: Direction) => void
  onPopoutClick: () => void
  undockTile: () => void
  displayCurrencyChart: () => void
  onNotificationDismissedClick: () => void
  tornOff: boolean
}

export default class SpotTile extends React.PureComponent<SpotTileProps> {
  render() {
    let { notification } = this.props.spotTileData
    if (!notification && this.props.spotTileData.price && this.props.spotTileData.price.priceStale) {
      notification = buildNotification(null, stalePriceErrorMessage)
    }
    const hasNotification = !!notification

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
    const { executionConnected, pricingConnected } = this.props
    const { isTradeExecutionInFlight, notification, price } = this.props.spotTileData
    const hasNotification = !!notification
    const className = classnames('spot-tile', {
      'spot-tile--stale':
        (!pricingConnected || (price && price.priceStale)) &&
        !(hasNotification && notification.notificationType === NotificationType.Trade),
      'spot-tile--readonly': !executionConnected,
      'spot-tile--executing': isTradeExecutionInFlight,
      'spot-tile--error': hasNotification && notification.hasError
    })

    return className
  }

  createSpotTileControls() {
    const { onPopoutClick, undockTile, displayCurrencyChart, isRunningOnDesktop, spotTileData, tornOff } = this.props

    return (
      <SpotTileControls
        onPopoutClick={onPopoutClick}
        currencyChartIsOpening={spotTileData.currencyChartIsOpening}
        displayCurrencyChart={displayCurrencyChart}
        isRunningOnDesktop={isRunningOnDesktop}
        undockTile={undockTile}
        tornOff={tornOff}
      />
    )
  }

  createPriceComponents() {
    const { currencyPair, spotTileData, executeTrade } = this.props
    const title = `${currencyPair.base} / ${currencyPair.terms}`
    if (spotTileData === null) {
      return null
    }

    return (
      <PriceControlsView
        currencyPair={currencyPair}
        title={title}
        priceData={spotTileData.price}
        executeTrade={executeTrade}
      />
    )
  }

  getSpotTileContent() {
    const { spotTileData, currencyPair } = this.props
    const hasNotification = !!spotTileData.notification
    const notionalInputClass = classnames('spot-tile__notional', {
      hide: hasNotification
    })
    const spotDateClass = classnames('spot-tile__delivery', {
      hide: hasNotification
    })
    const formattedDate = spotTileData.price ? spotDateFormatter(spotTileData.price.valueDate, false) : ''

    return (
      <div>
        <span className="spot-tile__execution-label">Executing</span>
        {this.createPriceComponents()}
        <NotionalContainer className={notionalInputClass} currencyPair={currencyPair} />
        <div className={spotDateClass}>
          <span className="spot-tile__tenor">SP</span>
          <span className="spot-tile__delivery-date">. {formattedDate}</span>
        </div>
      </div>
    )
  }

  createNotificationView(notification: Notification) {
    if (notification.notificationType === NotificationType.Trade) {
      return (
        <TradeNotification
          notification={notification}
          currencyPair={this.props.currencyPair}
          onDismissedClicked={() => this.props.onNotificationDismissedClick()}
        />
      )
    } else if (notification.notificationType === NotificationType.Text) {
      return <div className="spot-tile__notification-message">{notification.message}</div>
    } else {
      throw new Error(`Unknown notification type ${notification.notificationType}`)
    }
  }
}
