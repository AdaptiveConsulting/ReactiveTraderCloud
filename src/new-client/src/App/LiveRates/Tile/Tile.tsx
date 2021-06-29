import { memo } from "react"
import { merge, pipe } from "rxjs"
import { Direction } from "@/services/trades"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import { NotionalInput, notionalInput$ } from "./Notional"
import { HistoricalGraph, historicalGraph$ } from "./HistoricalGraph"
import { PriceButton, priceButton$ } from "./PriceButton"
import { Header, header$ } from "./Header"
import {
  Body,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
  PriceControlWrapper,
  GraphNotionalWrapper,
} from "./Tile.styles"
import { ExecutionResponse, executionResponse$ } from "./ExecutionResponse"

import { CurrencyPair } from "services/currencyPairs"
import { Provider, symbolBind } from "./Tile.context"
import {
  getRfqState$,
  isRfq$,
  QuoteStateStage,
  RfqButton,
  RfqTimer,
  useRfqState,
} from "./Rfq"
import { getIsSymbolDataStale$ } from "@/services/prices"
import { SUSPENSE } from "@react-rxjs/core"
import { map } from "rxjs/operators"

export const tile$ = (symbol: string) =>
  merge(
    ...[
      historicalGraph$,
      header$,
      priceMovement$,
      priceButton$(Direction.Sell),
      priceButton$(Direction.Buy),
      executionResponse$,
      getRfqState$,
      isRfq$,
      notionalInput$,
    ].map((fn) => fn(symbol)),
  )

const [useIsSymbolDataStale] = symbolBind(
  pipe(
    getIsSymbolDataStale$,
    map((isStale) => (isStale ? SUSPENSE : null)),
  ),
)

interface Props {
  HeaderComponent?: React.ComponentType
  isAnalytics: boolean
}

const Tile: React.FC<Props> = ({ isAnalytics, HeaderComponent = Header }) => {
  useIsSymbolDataStale()
  const rfq = useRfqState()
  const timerData =
    rfq.stage === QuoteStateStage.Received
      ? { start: rfq.payload.time, end: rfq.payload.time + rfq.payload.timeout }
      : null

  const InputTimerWrapper: React.FC<{ isAnalytics?: boolean }> = ({
    isAnalytics,
  }) => {
    return (
      <InputTimerStyle isAnalyticsView={!!isAnalytics}>
        <NotionalInput />
        {timerData ? (
          <RfqTimer {...timerData} isAnalyticsView={!!isAnalytics} />
        ) : null}
      </InputTimerStyle>
    )
  }

  return (
    <PanelItem>
      <Main>
        <HeaderComponent />
        <Body isAnalyticsView={isAnalytics} showTimer={!!timerData}>
          {isAnalytics ? (
            <GraphNotionalWrapper>
              <HistoricalGraph showTimer={!!timerData} />
              <InputTimerWrapper isAnalytics />
            </GraphNotionalWrapper>
          ) : null}
          <PriceControlWrapper>
            <PriceControlsStyle isAnalyticsView={isAnalytics}>
              <PriceMovement isAnalyticsView={isAnalytics} />
              <PriceButton direction={Direction.Sell} />
              <PriceButton direction={Direction.Buy} />
              <RfqButton isAnalytics={isAnalytics} />
            </PriceControlsStyle>
          </PriceControlWrapper>
          {!isAnalytics ? <InputTimerWrapper /> : null}
        </Body>
      </Main>
      <ExecutionResponse />
    </PanelItem>
  )
}
const TileContext: React.FC<{
  HeaderComponent?: React.ComponentType
  currencyPair: CurrencyPair
  isAnalytics: boolean
}> = memo(({ HeaderComponent = Header, currencyPair, isAnalytics }) => {
  return (
    <Provider value={currencyPair}>
      <Tile isAnalytics={isAnalytics} HeaderComponent={HeaderComponent} />
    </Provider>
  )
})

export { TileContext as Tile }
