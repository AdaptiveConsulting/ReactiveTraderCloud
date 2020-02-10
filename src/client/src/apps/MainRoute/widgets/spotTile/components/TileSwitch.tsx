import React from 'react'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData } from '../model'
import NotificationContainer from './notifications'
import Tile from './Tile'
import TileControls from './TileControls'
import { TileView } from '../../workspace/workspaceHeader'
import { RfqActions, TradingMode } from './types'
import { CurrencyPairNotional } from '../model/spotTileData'

interface Props {
  currencyPair?: CurrencyPair
  spotTileData: SpotTileData
  canPopout: boolean
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  onPopoutClick?: (x: number, y: number) => void
  onNotificationDismissed: () => void
  displayCurrencyChart?: () => void
  setTradingMode: (tradingMode: TradingMode) => void
  tileView?: TileView
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
          <TileControls canPopout={canPopout} onPopoutClick={onPopoutClick} />
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
