import React from "react"
import styled from "styled-components/macro"
import { interval } from "rxjs"
import { finalize, map, take } from "rxjs/operators"
import { onRejection, useRfqState } from "./Rfq.state"
import { symbolBind, useTileCurrencyPair } from "../Tile.context"
import { QuoteState } from "services/rfqs"

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
const durationSecs = 10
const intervalsPerSecond = 10
const [useTimerProgress] = symbolBind(
  (symbol) => {
    return interval(1_000 / intervalsPerSecond).pipe(
      map((intervals) => {
        const fractionSecondsElapsed = intervals / intervalsPerSecond
        const timeLeftSecs = Math.ceil(
          durationSecs - fractionSecondsElapsed - 1,
        )
        const percentageComplete =
          100 - (100 * fractionSecondsElapsed) / durationSecs
        return {
          timeLeftSecs,
          percentageComplete,
        }
      }),
      take(durationSecs * intervalsPerSecond),
      finalize(() => onRejection(symbol)),
    )
  },
  {
    timeLeftSecs: durationSecs,
    percentageComplete: 100,
  },
)

const RfqTimer: React.FC<{ isAnalyticsView: boolean }> = ({
  isAnalyticsView,
}) => {
  const { timeLeftSecs, percentageComplete } = useTimerProgress()
  const { symbol } = useTileCurrencyPair()
  return (
    <TimerWrapper isAnalyticsView={isAnalyticsView}>
      <TimeLeft isAnalyticsView={isAnalyticsView}>
        {timeLeftSecs} sec{timeLeftSecs > 1 ? "s" : ""}
      </TimeLeft>
      <ProgressBarWrapper isAnalyticsView={isAnalyticsView}>
        <ProgressBar style={{ width: `${percentageComplete}%` }} />
      </ProgressBarWrapper>
      <RejectQuoteButton
        isAnalyticsView={isAnalyticsView}
        onClick={() => onRejection(symbol)}
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
