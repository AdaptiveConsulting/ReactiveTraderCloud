import * as React from 'react'
import * as classnames from 'classnames'
import { TradeNotification, SpotTileControls } from './'
import * as moment from 'moment'
import './SpotTileStyles.scss'
import NotionalContainer from './notional/NotionalContainer'
import { NotificationType } from '../../types'
import { CurrencyPair } from '../../types/currencyPair'
import PriceControlsView from './priceControlsView/PriceControlsView'
import { SpotTileData } from '../../types/spotTileData'
import { SPOT_DATE_FORMAT } from './spotTileUtils'
import * as _ from 'lodash'
import { Notification } from '../../types/notification'

export interface SpotTileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionConnected: boolean
  isRunningInOpenFin: boolean
  executeTrade: (direction: any) => void
  onPopoutClick: () => void
  undockTile: () => void
  displayCurrencyChart: () => void
  onNotificationDismissedClick: () => void
}

export default class SpotTile extends React.Component<SpotTileProps, {}> {

  shouldComponentUpdate(nextProps:SpotTileProps, nextState: {}) {
    return !_.isEqual(nextProps.spotTileData, this.props.spotTileData)
  }

  render() {
    const { notification } = this.props.spotTileData
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
    const { executionConnected } = this.props
    const { isTradeExecutionInFlight, notification, priceStale } = this.props.spotTileData
    const hasNotification = !!notification
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
    const { onPopoutClick, undockTile, displayCurrencyChart, isRunningInOpenFin, spotTileData } = this.props

    return (
      <SpotTileControls onPopoutClick={onPopoutClick}
                        currencyChartIsOpening={spotTileData.currencyChartIsOpening}
                        displayCurrencyChart={displayCurrencyChart}
                        isRunningInOpenFin={isRunningInOpenFin}
                        undockTile={undockTile}/>
    )
  }

  createPriceComponents() {
    const { currencyPair, spotTileData, executeTrade } = this.props
    const title = `${currencyPair.base} / ${currencyPair.terms}`
    if (spotTileData === null) return null

    return (
      <PriceControlsView currencyPair={currencyPair}
                         title={title}
                         spotTileData={spotTileData}
                         executeTrade={executeTrade}/>
    )
  }

  getSpotTileContent() {
    const { spotTileData, currencyPair } = this.props
    const hasNotification = !!spotTileData.notification
    const notionalInputClass = classnames('spot-tile__notional', { hide: hasNotification })
    const spotDateClass = classnames('spot-tile__delivery', { hide: hasNotification })
    const formattedDate = spotTileData ? moment(spotTileData.valueDate).format(SPOT_DATE_FORMAT) : ''

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

  createNotificationView(notification: Notification) {
    if (notification.notificationType === NotificationType.Trade) {
      return (
        <TradeNotification
          notification={notification}
          currencyPair={this.props.currencyPair}
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
