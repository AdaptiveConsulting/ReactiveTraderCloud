import { StatelessExecutionResponse } from "@/App/LiveRates/Tile/ExecutionResponse"
import { HeaderInner } from "@/App/LiveRates/Tile/Header"
import { HistoricalGraph, HistoricalGraphComponent } from "@/App/LiveRates/Tile/HistoricalGraph"
import { NotionalInputInner } from "@/App/LiveRates/Tile/Notional"
import {
  AwaitingPriceButton,
  PriceButtonInner,
  PriceUnavailableButton,
} from "@/App/LiveRates/Tile/PriceButton"
import {
  PriceFromQuoteInner,
  PriceMovementInner,
} from "@/App/LiveRates/Tile/PriceMovement"
import { RfqTimer } from "@/App/LiveRates/Tile/Rfq"
import { RfqButtonInner } from "@/App/LiveRates/Tile/Rfq/RfqButton"
import { TileState } from "@/App/LiveRates/Tile/Tile.state"
import {
  Body,
  GraphNotionalWrapper,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
  PriceControlWrapper,
} from "@/App/LiveRates/Tile/Tile.styles"
import { CurrencyPair } from "@/services/currencyPairs"
import { PriceMovementType } from "@/services/prices"
import { Direction } from "@/services/trades"
import { format } from "date-fns"

export type TileProps = {
  currencyPair: CurrencyPair
  isAnalytics: boolean
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

export const Tile: React.FC<TileProps> = ({
  currencyPair,
  isAnalytics,
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
  rfqTextWrap,
  rfqButtonText,
  staticProgressWidth,
  isExpired,
  priceDisabled,
  priceButtonStatic,
  graphPath
}) => {
  const InputTimerWrapper: React.FC<{ isAnalytics?: boolean }> = ({
    isAnalytics,
  }) => {
    return (
      <InputTimerStyle isAnalyticsView={!!isAnalytics}>
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
          isTornOut={false}
        />
        <Body isAnalyticsView={isAnalytics} showTimer={!!timerData}>
          {isAnalytics ? (
            <GraphNotionalWrapper>
              <HistoricalGraphComponent showTimer={!!timerData} path={graphPath!} />
              <InputTimerWrapper isAnalytics />
            </GraphNotionalWrapper>
          ) : null}
          <PriceControlWrapper>
            <PriceControlsStyle isAnalyticsView={isAnalytics}>
              {isRfq ? (
                <PriceFromQuoteInner
                  isAnalytics={isAnalytics}
                  spread={priceMovement}
                />
              ) : (
                <PriceMovementInner
                  movementType={priceMovementType}
                  spread={priceMovement}
                  isAnalyticsView={isAnalytics}
                />
              )}

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
              {rfqButtonText && (
                <RfqButtonInner
                  isAnalytics={isAnalytics}
                  disabled={false}
                  onClick={() => null}
                  textWrap={!!rfqTextWrap}
                  buttonText={rfqButtonText!}
                />
              )}
            </PriceControlsStyle>
          </PriceControlWrapper>
          {!isAnalytics ? <InputTimerWrapper /> : null}
        </Body>
      </Main>
      <StatelessExecutionResponse
        currencyPair={currencyPair}
        tileState={tileState}
        onClose={() => null}
      />
    </PanelItem>
  )
}
