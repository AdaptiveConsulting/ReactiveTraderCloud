import React, { useLayoutEffect, useState } from "react"
import styled from "styled-components/macro"
import { onRejection } from "./Rfq.state"
import { useTileCurrencyPair } from "../Tile.context"

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

const ProgressBar = styled.div<{
  transitionTime: number
  width: number
}>`
  background-color: ${({ theme }) => theme.accents.primary.base};
  border-radius: 3px;
  transition: ${({ transitionTime }) => `width ${transitionTime}ms linear`};
  height: 100%;
  width: ${(p) => p.width}%;
`

const getInitialState = (start: number, end: number) => ({
  transitionTime: 0,
  width: ((end - Date.now()) / (end - start)) * 100,
  start,
  end,
})

const TimeProgress: React.FC<{
  start: number
  end: number
}> = ({ start, end }) => {
  const [state, setState] = useState(() => getInitialState(start, end))

  if (start !== state.start || end !== state.end)
    setState(getInitialState(start, end))

  useLayoutEffect(() => {
    const token = requestAnimationFrame(() => {
      setState((prev) => ({
        ...prev,
        transitionTime: end - Date.now(),
        width: 0,
      }))
    })
    return () => cancelAnimationFrame(token)
  }, [start, end])

  return <ProgressBar {...state} />
}

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
  z-index: 3;
`

const SecsTimer: React.FC<{ end: number }> = ({ end }) => {
  const [timeLeftSecs, setTimeLeftSecs] = useState(() =>
    Math.round((end - Date.now()) / 1000),
  )
  useLayoutEffect(() => {
    if (timeLeftSecs === 0) return
    const token = setTimeout(
      () => setTimeLeftSecs((x) => x - 1),
      end - (timeLeftSecs - 1) * 1000 - Date.now(),
    )
    return () => clearTimeout(token)
  }, [timeLeftSecs, end])

  return (
    <>
      {timeLeftSecs} sec{timeLeftSecs > 1 ? "s" : ""}
    </>
  )
}

export const RfqTimer: React.FC<{
  isAnalyticsView: boolean
  start: number
  end: number
}> = ({ isAnalyticsView, ...props }) => {
  const { symbol } = useTileCurrencyPair()

  return (
    <TimerWrapper isAnalyticsView={isAnalyticsView}>
      <TimeLeft isAnalyticsView={isAnalyticsView}>
        <SecsTimer {...props} />
      </TimeLeft>
      <ProgressBarWrapper isAnalyticsView={isAnalyticsView}>
        <TimeProgress {...props} />
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
