import React from "react"
import styled from "styled-components/macro"
import { interval, race, timer } from "rxjs"
import { filter, finalize, map, takeUntil, tap } from "rxjs/operators"
import { onRejection, useRfqState } from "./Rfq.state"
import { symbolBind, useTileCurrencyPair } from "../Tile.context"
import { QuoteState } from "services/rfqs"
import { createListener } from "@react-rxjs/utils"

const TimeLeft = styled.div<{ isAnalyticsView: boolean }>`
  font-size: 10px;
  opacity: 0.6;
  grid-area: TimeLeft;
  ${({ isAnalyticsView }) =>
    isAnalyticsView ? "margin-top: 4.5px" : "margin-bottom: 1px"};
`

const ProgressBarWrapper = styled.div<{ isAnalyticsView: boolean }>`
  background-color: ${({ theme }) => theme.core.darkBackground};
  height: 6px;
  width: 100%;
  grid-area: ProgressBar;
  align-self: ${({ isAnalyticsView }) => (isAnalyticsView ? "end" : "center")};
  ${({ isAnalyticsView }) =>
    isAnalyticsView ? "margin-bottom: 4.5px" : "margin-top: 1px"};
`

const ProgressBar = styled.div`
  background-color: ${({ theme }) => theme.accents.primary.base};
  border-radius: 3px;
  transition: width 200ms linear;
  height: 100%;
`

const RejectQuoteButton = styled.button<{ isAnalyticsView: boolean }>`
  background-color: ${({ theme }) => `${theme.core.lightBackground}`};
  border: ${({ theme }) => `2px solid ${theme.core.darkBackground}`};
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 5px 3px 5px;
  margin-left: 9px;
  grid-area: RejectQuoteButton;
  align-self: ${({ isAnalyticsView }) => (isAnalyticsView ? "end" : "center")};
`

const TimerWrapper = styled.div<{ isAnalyticsView: boolean }>`
  display: grid;
  width: ${({ isAnalyticsView }) =>
    isAnalyticsView ? "calc(100% + 23.09px)" : "100%"};
  align-items: center;
  grid-template-columns: ${({ isAnalyticsView }) =>
    isAnalyticsView ? "35px auto 55px" : "35px auto 7px 55px"};
  grid-template-rows: ${({ isAnalyticsView }) =>
    isAnalyticsView ? "5px 20px" : "auto"};
  grid-template-areas: ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? "'TimeLeft . .' 'ProgressBar ProgressBar RejectQuoteButton'"
      : "'TimeLeft ProgressBar . RejectQuoteButton'"};
  margin-bottom: -12px;
`
const [rejectButtonClicks$, onRejectButtonClick] = createListener<string>()

const durationSecs = 10
const intervalsPerSecond = 10
const oneSecond = 1_000
const [useTimerProgress] = symbolBind(
  (symbol) => {
    return interval(oneSecond / intervalsPerSecond).pipe(
      map((intervals) => {
        const fractionSecondsElapsed = intervals / intervalsPerSecond
        const timeLeftSecs = Math.ceil(
          durationSecs - fractionSecondsElapsed - 1,
        )
        const percentageLeft =
          100 - (100 * fractionSecondsElapsed) / durationSecs
        return {
          timeLeftSecs,
          percentageLeft,
        }
      }),
      takeUntil(
        race(
          timer(durationSecs * oneSecond),
          rejectButtonClicks$.pipe(
            tap((e) => console.log(e)),
            filter((eventSymbol) => eventSymbol === symbol),
          ),
        ),
      ),
      finalize(() => onRejection(symbol)),
    )
  },
  {
    timeLeftSecs: durationSecs,
    percentageLeft: 100,
  },
)

const RfqTimer: React.FC<{ isAnalyticsView: boolean }> = ({
  isAnalyticsView,
}) => {
  const { timeLeftSecs, percentageLeft } = useTimerProgress()
  const { symbol } = useTileCurrencyPair()
  return (
    <TimerWrapper isAnalyticsView={isAnalyticsView}>
      <TimeLeft isAnalyticsView={isAnalyticsView}>
        {timeLeftSecs} sec{timeLeftSecs > 1 ? "s" : ""}
      </TimeLeft>
      <ProgressBarWrapper isAnalyticsView={isAnalyticsView}>
        <ProgressBar style={{ width: `${percentageLeft}%` }} />
      </ProgressBarWrapper>
      <RejectQuoteButton
        isAnalyticsView={isAnalyticsView}
        onClick={() => onRejectButtonClick(symbol)}
      >
        Reject
      </RejectQuoteButton>
    </TimerWrapper>
  )
}

const RfqTimerStateWrapper: React.FC<{ isAnalyticsView: boolean }> = ({
  isAnalyticsView,
}) => {
  const rfqState = useRfqState()
  return rfqState?.quoteState === QuoteState.Received ? (
    <RfqTimer isAnalyticsView={isAnalyticsView} />
  ) : null
}

export { RfqTimerStateWrapper as RfqTimer }
