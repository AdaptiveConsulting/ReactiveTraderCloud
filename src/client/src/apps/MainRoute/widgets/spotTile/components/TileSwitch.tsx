import React from 'react'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileDataWithNotional } from '../model'
import NotificationContainer from './notifications'
import Tile from './Tile'
import TileControls from './TileControls'
import { TileViews } from '../../workspace/workspaceHeader'
import { RfqActions, TradingMode } from './types'
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
  const { isRfqStateNone } = getConstsFromRfqState(spotTileData.rfqState)

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
      {() => (
        <>
          <TileControls canPopout={isRfqStateNone && canPopout} onPopoutClick={onPopoutClick} />
          <NotificationContainer
            lastTradeExecutionStatus={spotTileData.lastTradeExecutionStatus}
            currencyPair={currencyPair}
            onNotificationDismissed={onNotificationDismissed}
          />
        </>
      )}
    </Tile>
  )
}

export default TileSwitch
