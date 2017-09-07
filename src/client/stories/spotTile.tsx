import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from '../src/combineReducers'
import {
  getButtonProps,
  getContainerStyling,
  getNotionalInputProps,
  getPriceMovementIndicatorProps,
  getSpotTileProps,
  getTradeNotificationProps,
} from './spotTile/'
import SpotTile, { NotionalInput, PriceButton, PriceMovementIndicator, TradeNotification } from '../src/ui/spotTile'
import '../src/ui/spotTile/SpotTileStyles.scss'

const getButtons = (withContainerClass = true) =>
  <div className={withContainerClass ? 'spot-tile' : ''}>
    <PriceButton {...getButtonProps('Sell', action)} />
    <PriceButton {...getButtonProps('Buy', action)} />
  </div>

const store = createStore(rootReducer)

storiesOf('Spot Tile', module)
  .addDecorator((story) => (
    <Provider store={store}>
      {story()}
    </Provider>))
  .add('Full tile', () =>
    <div style={getContainerStyling}>
      <SpotTile {...getSpotTileProps()} />
    </div>)
  .add('Buy & Sell buttons', () =>
    <div className="spot-tile" style={getContainerStyling}>
      <div className="spot-tile__container">
        <PriceButton {...getButtonProps('Sell', action)} />
        <PriceButton {...getButtonProps('Buy', action)} />
      </div>
    </div>)
  .add('Notional Input', () =>
    <div className="spot-tile" style={getContainerStyling}>
      <div className="spot-tile__container">
        <NotionalInput {...getNotionalInputProps} />
      </div>
    </div>)
  .add('Notional Input & Buttons', () =>
    <div className="spot-tile" style={getContainerStyling}>
      <div className="spot-tile__container">
        <div>{getButtons(false)}</div>
        <NotionalInput {...getNotionalInputProps} />
      </div>
    </div>)
  .add('Trade notification', () =>
    <div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__container">
          <TradeNotification {...getTradeNotificationProps('Rejected', 'Up', false, action)} />
        </div>
      </div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__container">
          <TradeNotification {...getTradeNotificationProps('Done', 'Down', false, action)} />
        </div>
      </div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__container">
          <TradeNotification {...getTradeNotificationProps('Done', 'Down', true, action)} />
        </div>
      </div>
    </div>)
  .add('Price movement indicator', () =>
    <div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator {...getPriceMovementIndicatorProps('Up', '1.12')} />
        </div>
      </div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator {...getPriceMovementIndicatorProps('Down', '-2.42')} />
        </div>
      </div>
    </div>)
