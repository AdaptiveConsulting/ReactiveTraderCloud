import { Direction } from '../../src/types/direction'
import { NotificationType } from '../../src/types/notificationType'
import { SpotTileProps } from '../../src/ui/spotTile/SpotTile'
import { TradeStatus } from '../../src/types/tradeStatus'

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const getContainerStyling = {
  margin: '50px auto 0',
  width: '30%',
  minWidth: '300px',
  padding: '5px',
}

export const getSpotTileProps: () => SpotTileProps = (executionConnected: boolean = true, isTradeExecutionInFlight: boolean = false) => {
  return {
    canPopout: true,
    currencyChartIsOpening: false,
    currencyPair: {
      symbol: 'GBP',
      base: 'GBP',
      ratePrecision: 0,
      pipsPosition: 0,
      terms: '',
    },
    currentSpotPrice: {
      ask: getButtonProps('ask', () => {}).rate,
      bid: getButtonProps('ask', () => {}).rate,
      priceMovementType: 'Up',
      spread: {
        formattedValue: '-1.23',
      },
      valueDate: 1234436547,
    },
    executionConnected,
    hasNotification: false,
    isRunningInOpenFin: false,
    isTradeExecutionInFlight,
    maxNotional: 5000000,
    notification: {
      error: null,
      notificationType: NotificationType.Trade,
      hasError: false,
    },
    notional: 500,
    priceStale: false,
    title: 'GBP / USD',
    executeTrade: () => {},
    onComponentMount: () => {},
    onPopoutClick: () => {},
    undockTile: () => {},
    displayCurrencyChart: () => {},
    onNotificationDismissedClick: () => {}
  }
}

export const getButtonProps = (type: string, action: any) => {

  const classNameType = type === 'Sell' ? 'bid' : 'ask'

  return {
    className: `spot-tile__price spot-tile__price--${classNameType}`,
    direction: Direction[type],
    rate: {
      pips: getRandomNumber(0, 99),
      bigFigure: getRandomNumber(0, 150),
      pipFraction: getRandomNumber(0, 9),
      rawRate: 123,
    },
    onExecute: action('buy clicked'),
  }
}

export const getNotionalInputProps = {
  className: 'spot-tile__notional',
  notional: 1000000,
  currencyPair: { symbol: 'GBP', base: 'GBP', ratePrecision: 0, pipsPosition: 0, terms: '' },
  onChange: () => console.log('Changed'),
  maxValue: 5000000,
  onNotionalInputChange: () => {},
}

export const getPriceMovementIndicatorProps = (priceMovementType: string,
                                               formattedValue: string) => {
  return {
    priceMovementType,
    spread: {
      formattedValue,
    },
  }
}

export const getTradeNotificationProps = (status: string,
                                          direction: string,
                                          hasError: boolean,
                                          action: any) => {
  return {
    className: 'spot-tile__trade-summary',
    notification: {
      hasError,
      status: TradeStatus[status],
      dealtCurrency: 'GBP',
      notional: getRandomNumber(40, 5222),
      termsCurrency: 'USD',
      direction: 'Up',
      spotRate: getRandomNumber(40, 5222),
      formattedValueDate: 'SP. Jul 26',
      tradeId: getRandomNumber(4012, 15222).toString(),
    },
    onDismissedClicked: action('dismiss notification'),
  }
}
