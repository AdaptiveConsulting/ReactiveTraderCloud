import React from 'react'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileDataWithNotional } from '../model'
import NotificationContainer, { TileBooking } from './notifications'
import Tile from './Tile'
import TileControls from './TileControls'
import { TileViews } from '../../workspace/workspaceHeader'
import { RfqActions, TileSwitchChildrenProps, TradingMode } from './types'
import { getConstsFromRfqState } from '../model/spotTileUtils'
import { CurrencyPairNotional } from '../model/spotTileData'

interface Props {
  currencyPair?: CurrencyPair
  spotTileData: SpotTileDataWithNotional
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

  if (!currencyPair) {
    return <></>
  }

  return (
    <Tile
      currencyPair={currencyPair}
      spotTileData={spotTileData}
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
            lastTradeExecutionStatus={spotTileData.lastTradeExecutionStatus}
            spotDate={spotTileData.price.valueDate}
            currencyPair={currencyPair}
            onNotificationDismissed={onNotificationDismissed}
          />
        </>
      )}
    </Tile>
  )
}

export default TileSwitch
