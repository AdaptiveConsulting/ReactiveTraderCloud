import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const getRandomRate = () => {
  return toRate(123, getRandomNumber(0, 10), getRandomNumber(0, 9))
}

import rootReducer from '../src/redux/reducers/combineReducers'
import {
  getContainerStyling,
  getNotionalInputProps,
  getPriceMovementIndicatorProps,
  getSpotTileProps,
  getTradeNotification,
} from './spotTile/'
import SpotTile, { NotionalInput, PriceButton, PriceMovementIndicator, TradeNotification } from '../src/ui/spotTile'
import '../src/ui/spotTile/SpotTileStyles.scss'
import { Direction } from '../src/types/direction'
import { toRate } from '../src/ui/spotTile/spotTileUtils'
import { getCurrencyPair } from './currencyPairs'

const getButtons = (withContainerClass = true) => {
  const sellButtonClassName = `spot-tile__price spot-tile__price--bid`
  const buyButtonClassName = `spot-tile__price spot-tile__price--ask`
  return (<div className={withContainerClass ? 'spot-tile' : ''}>
    <PriceButton className={sellButtonClassName}
                 onExecute={action('sell clicked')}
                 rate={getRandomRate()}
                 direction={Direction.Sell} />
    <PriceButton className={buyButtonClassName}
                 onExecute={action('buy clicked')}
                 rate={getRandomRate()}
                 direction={Direction.Buy} />
  </div>)
}

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
  .add('Buy & Sell buttons', () => {

    return (<div className="spot-tile" style={getContainerStyling}>
      {getButtons(true)}
    </div>)
  })
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
          <TradeNotification notification={getTradeNotification('Rejected', 'Up', false)}
                             currencyPair={getCurrencyPair('GBPUSD')}
                             onDismissedClicked={action('dismiss notification')} />
        </div>
      </div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__container">
          <TradeNotification notification={getTradeNotification('Done', 'Down', false)}
                             currencyPair={getCurrencyPair('GBPUSD')}
                             onDismissedClicked={action('dismiss notification')}/>
        </div>
      </div>
      <div className="spot-tile" style={getContainerStyling}>
        <div className="spot-tile__container">
          <TradeNotification notification={getTradeNotification('Done', 'Down', true)}
                             currencyPair={getCurrencyPair('GBPUSD')}
                             onDismissedClicked={action('dismiss notification')} />
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
