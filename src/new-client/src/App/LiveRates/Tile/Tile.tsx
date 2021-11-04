import { memo } from "react"
import { merge, pipe } from "rxjs"
import { Direction } from "@/services/trades"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import {
  NotionalInput,
  notionalInput$,
  NotionalInputComponent,
} from "./Notional"
import { HistoricalGraph, historicalGraph$ } from "./HistoricalGraph"
import { PriceButton, priceButton$ } from "./PriceButton"
import { Header, header$, HeaderComponent } from "./Header"
import { PriceMovementComponent } from "@/App/LiveRates/Tile/PriceMovement/PriceMovement"
import {
  PriceButtonInnerComponent,
  PriceButtonDisabledBanIcon,
  PriceButtonAwaitingIcon,
} from "@/App/LiveRates/Tile/PriceButton"
import {
  Body,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
  PriceControlWrapper,
  GraphNotionalWrapper,
  MainComponent,
} from "./Tile.styles"
import { ExecutionResponse, executionResponse$ } from "./ExecutionResponse"

import { CurrencyPair } from "services/currencyPairs"
import { Provider, symbolBind, useTileContext } from "./Tile.context"
import {
  getRfqState$,
  isRfq$,
  QuoteStateStage,
  RfqButton,
  RfqTimer,
  RfqTimerComponent,
  RfqButtonComponent,
  useRfqState,
} from "./Rfq"
import { getIsSymbolDataStale$, PriceMovementType } from "@/services/prices"
import Pending from "@/App/LiveRates/Tile/ExecutionResponse/Pending"
import { SUSPENSE } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { isMobileDevice } from "@/utils"

import { HistoricalGraphComponent } from "@/App/LiveRates/Tile/HistoricalGraph/HistoricalGraph"

import {
  MockProps,
  generateHistoricPrices,
  mockValues,
  HistoryMockSvgPath,
} from "@/styleguide/components/SpotTilesMockData"

import { format } from "date-fns"

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
  isAnalytics: boolean
}

const Tile: React.FC<Props> = ({ isAnalytics }) => {
  useIsSymbolDataStale()
  const rfq = useRfqState()
  const { supportsTearOut } = useTileContext()
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
    <PanelItem shouldMoveDate={supportsTearOut}>
      <Main>
        <Header />
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
  currencyPair: CurrencyPair
  isAnalytics: boolean
  isTornOut?: boolean
  supportsTearOut?: boolean
}> = memo(
  ({
    currencyPair,
    isAnalytics,
    isTornOut = false,
    supportsTearOut = true,
  }) => {
    return (
      <Provider
        value={{
          currencyPair,
          isTornOut,
          supportsTearOut: supportsTearOut && !isMobileDevice,
        }}
      >
        <Tile isAnalytics={isAnalytics} />
      </Provider>
    )
  },
)

export const TileMockComponent: React.FC<MockProps> = ({
  spotTileData,
  isAnalytics = false,
  currencyPair,
  supportsTearOut = false,
  hover = false,
  activeColorLeft = false,
  activeColorRight = false,
  disabledInput = false,
  isStale = false,
  isExecuting = false,
  faded = false,
  resetInput = false,
  buttonText = "",
  awaiting = false,
  startTimer = 0,
  rfqStateRight = { stage: QuoteStateStage.Requested },
  rfqStateLeft = { stage: QuoteStateStage.Requested },
  isExpired = false,
}) => {
  const InputTimerWrapper: React.FC<{
    isAnalytics?: boolean
    spotTile: any
    currencyPair: any
    disabledInput: boolean
    resetInput: boolean
    startTimer: number
  }> = ({ isAnalytics, spotTile, currencyPair, resetInput, startTimer }) => {
    return (
      <InputTimerStyle isAnalyticsView={!!isAnalytics}>
        <NotionalInputComponent
          resetInput={resetInput}
          spotTile={spotTile}
          currencyPair={currencyPair}
          disabled={disabledInput}
          isAnalytics={isAnalytics}
        />
        {startTimer !== 0 ? (
          <RfqTimerComponent
            start={startTimer}
            end={60}
            isAnalyticsView={!!isAnalytics}
          />
        ) : null}
      </InputTimerStyle>
    )
  }

  const noPriceMovement =
    isStale ||
    startTimer !== 0 ||
    (!isAnalytics && buttonText !== "") ||
    isExecuting
  const movementType = isAnalytics
    ? PriceMovementType.UP
    : PriceMovementType.DOWN
  const buttonProps = {
    disabled: false,
    isExpired: isExpired,
    disabledHover: true,
    hover: hover,
    faded: faded,
  }
  const dateVal = `SPT (${format(new Date("08/04"), "dd MMM").toUpperCase()})`
  return (
    <PanelItem shouldMoveDate={false}>
      <MainComponent>
        <HeaderComponent
          date={dateVal}
          base={currencyPair.base}
          terms={currencyPair.terms}
          tearOutMock={supportsTearOut}
        />
        <Body isAnalyticsView={isAnalytics} showTimer={false}>
          {isAnalytics ? (
            <GraphNotionalWrapper>
              <HistoricalGraphComponent
                history={HistoryMockSvgPath}
                showTimer={startTimer !== 0}
                active={false}
              />
              <InputTimerWrapper
                spotTile={spotTileData}
                currencyPair={currencyPair}
                disabledInput={disabledInput}
                resetInput={resetInput}
                startTimer={startTimer}
                isAnalytics={isAnalytics}
              />
            </GraphNotionalWrapper>
          ) : null}
          <PriceControlWrapper>
            <PriceControlsStyle isAnalyticsView={isAnalytics}>
              <PriceMovementComponent
                isAnalyticsView={isAnalytics}
                movementType={
                  noPriceMovement ? PriceMovementType.NONE : movementType
                }
                spread="0.8"
                isStale={isStale}
              />

              {!isStale && !awaiting && (
                <PriceButtonInnerComponent
                  direction={Direction.Sell}
                  rfqQuoteState={rfqStateLeft}
                  activeColor={activeColorLeft}
                  {...buttonProps}
                  {...mockValues}
                />
              )}

              {isStale && (
                <PriceButtonDisabledBanIcon>
                  Pricing unavailable{" "}
                </PriceButtonDisabledBanIcon>
              )}

              {awaiting && <PriceButtonAwaitingIcon />}

              {!isStale && !awaiting && (
                <PriceButtonInnerComponent
                  direction={Direction.Buy}
                  rfqQuoteState={rfqStateRight}
                  activeColor={activeColorRight}
                  {...buttonProps}
                  {...mockValues}
                />
              )}

              {isStale && (
                <PriceButtonDisabledBanIcon>
                  Pricing unavailable
                </PriceButtonDisabledBanIcon>
              )}

              {awaiting && <PriceButtonAwaitingIcon />}

              {buttonText !== "" && (
                <RfqButtonComponent
                  isAnalytics={isAnalytics}
                  buttonText={buttonText}
                  textWrap={false}
                  validNotional={true}
                />
              )}
            </PriceControlsStyle>
          </PriceControlWrapper>
          {!isAnalytics ? (
            <InputTimerWrapper
              spotTile={spotTileData}
              currencyPair={currencyPair}
              disabledInput={disabledInput}
              resetInput={resetInput}
              startTimer={startTimer}
            />
          ) : null}
        </Body>
      </MainComponent>
      {isExecuting && <Pending />}
    </PanelItem>
  )
}

export { TileContext as Tile }
