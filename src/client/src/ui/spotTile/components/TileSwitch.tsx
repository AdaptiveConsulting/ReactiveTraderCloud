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
import { getNumericNotional } from './TileBusinessLogic'
import { getConstsFromRfqState } from '../model/spotTileUtils'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  canPopout: boolean
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  onPopoutClick?: () => void
  onNotificationDismissed: () => void
  displayCurrencyChart?: () => void
  setTradingMode: (tradingMode: TradingMode) => void
  tileView?: TileViews
  rfq: RfqActions
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
}) => {
  const {
    isRfqExpired,
    isRfqStateCanRequest,
    isRfqStateRequested,
    isRfqStateNone,
  } = getConstsFromRfqState(spotTileData.rfqState)

  return (
    <Tile
      currencyPair={currencyPair}
      spotTileData={spotTileData}
      executeTrade={executeTrade}
      executionStatus={executionStatus}
      tileView={tileView}
      setTradingMode={setTradingMode}
      rfq={rfq}
    >
      {({ notional, userError }: TileSwitchChildrenProps) => (
        <>
          <TileControls
            canPopout={isRfqStateNone && canPopout}
            onPopoutClick={onPopoutClick}
            displayCurrencyChart={displayCurrencyChart}
          />
          <TileBooking show={spotTileData.isTradeExecutionInFlight} color="blue" showLoader>
            Executing
          </TileBooking>
          <TileBooking
            show={!spotTileData.isTradeExecutionInFlight && isRfqStateCanRequest}
            color="blue"
            onBookingPillClick={() =>
              rfq.request({ notional: getNumericNotional(notional), currencyPair })
            }
            disabled={userError}
          >
            Initiate
            <br />
            RFQ
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
          <TileBooking
            show={isRfqExpired}
            color="blue"
            onBookingPillClick={() =>
              rfq.request({ notional: getNumericNotional(notional), currencyPair })
            }
          >
            Requote
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
    currencyChartIsOpening: false,
    lastTradeExecutionStatus: null,
    rfqState: 'none',
    rfqPrice: null,
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
