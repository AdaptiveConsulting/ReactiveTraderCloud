import { format } from "date-fns"

import { StatelessExecutionResponse } from "@/client/App/LiveRates/Tile/ExecutionResponse"
import { HeaderInner } from "@/client/App/LiveRates/Tile/Header"
import { HistoricalGraphComponent } from "@/client/App/LiveRates/Tile/HistoricalGraph"
import { NotionalInputInner } from "@/client/App/LiveRates/Tile/Notional"
import {
  AwaitingPriceButton,
  PriceButtonInner,
  PriceUnavailableButton,
} from "@/client/App/LiveRates/Tile/PriceButton"
import { PriceMovementInner } from "@/client/App/LiveRates/Tile/PriceMovement"
import { RfqTimer } from "@/client/App/LiveRates/Tile/Rfq"
import { RfqButtonInner } from "@/client/App/LiveRates/Tile/Rfq/RfqButton"
import { useTileContext } from "@/client/App/LiveRates/Tile/Tile.context"
import { TileState, TileStates } from "@/client/App/LiveRates/Tile/Tile.state"
import {
  Body,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
} from "@/client/App/LiveRates/Tile/Tile.styles"
import { Stack } from "@/client/components/Stack"
import { Direction } from "@/generated/TradingGateway"
import { CurrencyPair } from "@/services/currencyPairs"
import { PriceMovementType } from "@/services/prices"

export type TileProps = {
  currencyPair: CurrencyPair
  isAnalytics?: boolean
  timerData?: {
    start: number
    end: number
  }
  canResetNotional?: boolean
  disabledNotional?: boolean
  notional: string
  priceMovement: string
  priceMovementType?: PriceMovementType
  sellPrice?: number
  buyPrice?: number
  hover?: boolean
  tileState: TileState
  isRfq?: boolean
  rfqTextWrap?: boolean
  rfqButtonText?: string
  staticProgressWidth?: number
  isExpired?: boolean
  priceDisabled?: boolean
  priceButtonStatic?: boolean
  graphPath?: string
}

export const Tile = ({
  timerData,
  canResetNotional,
  disabledNotional,
  notional,
  priceMovement,
  priceMovementType,
  sellPrice,
  buyPrice,
  hover,
  tileState,
  isRfq,
  rfqButtonText,
  staticProgressWidth,
  isExpired,
  priceDisabled,
  priceButtonStatic,
  graphPath,
}: TileProps) => {
  const { showingChart, currencyPair } = useTileContext()

  const InputTimerWrapper = ({ isAnalytics }: { isAnalytics?: boolean }) => {
    return (
      <InputTimerStyle>
        <NotionalInputInner
          base={currencyPair.base}
          canReset={!!canResetNotional}
          disabled={!!disabledNotional}
          id={`notional-input-${currencyPair.symbol}`}
          onChange={() => null}
          onReset={() => null}
          valid
          value={notional}
        />
        {timerData ? (
          <RfqTimer
            {...timerData}
            isAnalyticsView={!!isAnalytics}
            onReject={() => null}
            isStatic
            staticProgressWidth={staticProgressWidth}
          />
        ) : null}
      </InputTimerStyle>
    )
  }

  return (
    <PanelItem shouldMoveDate={true} className={hover ? "tile-hover" : ""}>
      <Main>
        <HeaderInner
          currencyPair={currencyPair}
          date={`SPT (${format(new Date(), "dd MMM").toUpperCase()})`}
          onClick={() => null}
          supportsTearOut={true}
          executing={tileState.status === TileStates.Started}
          isTornOut={false}
        />
        <Body>
          {showingChart && graphPath ? (
            <HistoricalGraphComponent
              showTimer={!!timerData}
              path={graphPath}
            />
          ) : null}
          <PriceControlsStyle>
            <PriceMovementInner
              movementType={isRfq ? PriceMovementType.NONE : priceMovementType}
              spread={priceMovement}
              showingChart={showingChart}
            />

            <Stack justifyContent="center" alignItems="center">
              {sellPrice ? (
                <PriceButtonInner
                  direction={Direction.Sell}
                  currencyPair={currencyPair}
                  onClick={() => null}
                  disabled={!!priceDisabled}
                  isExpired={!!isExpired}
                  priceAnnounced={!!timerData}
                  price={sellPrice}
                  isStatic={!!priceButtonStatic}
                />
              ) : isRfq ? (
                <AwaitingPriceButton />
              ) : (
                <PriceUnavailableButton />
              )}
            </Stack>
            <Stack justifyContent="center" alignItems="center">
              {buyPrice ? (
                <PriceButtonInner
                  direction={Direction.Buy}
                  currencyPair={currencyPair}
                  onClick={() => null}
                  disabled={!!priceDisabled}
                  isExpired={!!isExpired}
                  priceAnnounced={!!timerData}
                  price={buyPrice}
                  isStatic={!!priceButtonStatic}
                />
              ) : isRfq ? (
                <AwaitingPriceButton />
              ) : (
                <PriceUnavailableButton />
              )}
            </Stack>
            {rfqButtonText && typeof rfqButtonText === "string" && (
              <RfqButtonInner
                disabled={false}
                onClick={() => null}
                cancellable={false}
              >
                {rfqButtonText}
              </RfqButtonInner>
            )}
          </PriceControlsStyle>
        </Body>
        <InputTimerWrapper />
      </Main>
      <StatelessExecutionResponse
        currencyPair={currencyPair}
        tileState={tileState}
        onClose={() => null}
      />
    </PanelItem>
  )
}
