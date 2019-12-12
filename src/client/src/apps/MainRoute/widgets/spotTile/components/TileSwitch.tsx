import React from 'react'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData } from '../model'
import { PriceMovementTypes } from '../model/priceMovementTypes'
import { TileBooking } from './notifications'
import NotificationContainer from './notifications'
import Tile from './Tile'
import TileControls from './TileControls'
import { TileViews } from '../../workspace/workspaceHeader'
import { TileSwitchChildrenProps, RfqActions, TradingMode } from './types'
import { getConstsFromRfqState } from '../model/spotTileUtils'
import { CurrencyPairNotional } from '../model/spotTileData'
import { getDefaultInitialNotionalValue } from './Tile/TileBusinessLogic'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  canPopout: boolean
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  onPopoutClick?: (x: number, y: number) => void
  onNotificationDismissed: () => void
  displayCurrencyChart?: () => void
  setTradingMode: (tradingMode: TradingMode) => void
  tileView?: TileViews
  rfq: RfqActions
  updateNotional: (currencyPairNotional: CurrencyPairNotional) => void
}

const TileSwitch: React.FC<Props> = ({
  currencyPair,
  spotTileData,
  executeTrade,
  canPopout,
  onPopoutClick,
  onNotificationDismissed,
  displayCurrencyChart,
  executionStatus,
  tileView,
  setTradingMode,
  rfq,
  updateNotional,
}) => {
  const {
    isRfqStateExpired,
    isRfqStateCanRequest,
    isRfqStateRequested,
    isRfqStateNone,
  } = getConstsFromRfqState(spotTileData.rfqState)

  const spotTileDataWithNotional =
    spotTileData.notional === null
      ? {
          ...spotTileData,
          notional: getDefaultInitialNotionalValue(currencyPair),
        }
      : spotTileData

  return (
    <Tile
      currencyPair={currencyPair}
      spotTileData={spotTileDataWithNotional}
      executeTrade={executeTrade}
      executionStatus={executionStatus}
      tileView={tileView}
      setTradingMode={setTradingMode}
      rfq={rfq}
      displayCurrencyChart={displayCurrencyChart}
      updateNotional={updateNotional}
    >
      {({ notional, userError }: TileSwitchChildrenProps) => (
        <>
          <TileControls canPopout={isRfqStateNone && canPopout} onPopoutClick={onPopoutClick} />
          <TileBooking show={spotTileData.isTradeExecutionInFlight} color="blue" showLoader>
            Executing
          </TileBooking>
          <TileBooking
            show={!spotTileData.isTradeExecutionInFlight && isRfqStateCanRequest}
            color="blue"
            onBookingPillClick={() => rfq.request({ notional, currencyPair })}
            disabled={userError}
          >
            Initiate
            <br />
            RFQ
          </TileBooking>
          <TileBooking
            show={!spotTileData.isTradeExecutionInFlight && isRfqStateExpired}
            color="blue"
            onBookingPillClick={() => rfq.requote({ notional, currencyPair })}
          >
            Requote
          </TileBooking>
          <TileBooking
            show={isRfqStateRequested}
            color="red"
            onBookingPillClick={() => rfq.cancel({ currencyPair })}
          >
            Cancel
            <br />
            RFQ
          </TileBooking>
          <NotificationContainer
            isPriceStale={!spotTileData.lastTradeExecutionStatus && spotTileData.price.priceStale}
            lastTradeExecutionStatus={spotTileData.lastTradeExecutionStatus}
            currencyPair={currencyPair}
            onNotificationDismissed={onNotificationDismissed}
          />
        </>
      )}
    </Tile>
  )
}

TileSwitch.defaultProps = {
  spotTileData: {
    notional: null,
    isTradeExecutionInFlight: false,
    historicPrices: [],
    price: {
      ask: 0,
      bid: 0,
      mid: 0,
      creationTimestamp: 0,
      symbol: '',
      valueDate: '',
      priceMovementType: PriceMovementTypes.None,
      priceStale: false,
    },
    lastTradeExecutionStatus: null,
    rfqState: 'none',
    rfqPrice: null,
    rfqReceivedTime: null,
    rfqTimeout: null,
  },
  currencyPair: {
    symbol: '',
    ratePrecision: 0,
    pipsPosition: 0,
    base: '',
    terms: '',
  },
}

export default TileSwitch
