import { useLayoutEffect, useState } from "react"
import styled from "styled-components"
import { onRejectQuote } from "./Rfq.state"
import { useTileCurrencyPair } from "../Tile.context"

const TimeLeft = styled.div<{ isAnalyticsView: boolean }>`
  font-size: 10px;
  opacity: 0.6;
  grid-area: TimeLeft;
  white-space: nowrap;
  margin-right: 0.5rem;
`

const ProgressBarWrapper = styled.div<{ isAnalyticsView: boolean }>`
  background-color: ${({ theme }) => theme.core.darkBackground};
  height: 6px;
  width: 100%;
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
  end,
})

const TimeProgress: React.FC<{
  start: number
  end: number
}> = ({ start, end }) => {
  const [state, setState] = useState(() => getInitialState(start, end))

  useLayoutEffect(() => {
    if (state.transitionTime > 0 && state.width === 0) return
    const token = requestAnimationFrame(() => {
      setState((prev) => {
        return {
          ...prev,
          ...(prev.transitionTime > 0
            ? { width: 0 }
            : { transitionTime: prev.end - Date.now() }),
        }
      })
    })
    return () => {
      cancelAnimationFrame(token)
    }
  }, [state])

  return <ProgressBar {...state} />
}

const RejectQuoteButton = styled.button<{ isAnalyticsView: boolean }>`
  background-color: ${({ theme }) => `${theme.core.lightBackground}`};
  border: ${({ theme }) => `2px solid ${theme.core.darkBackground}`};
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 5px 3px 5px;
  margin-left: 9px;
`

const TimerWrapper = styled.div<{ isAnalyticsView: boolean }>`
  display: flex;
  align-items: center;
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
    <TimerWrapper isAnalyticsView={isAnalyticsView} data-testid="rfqTimer">
      <TimeLeft isAnalyticsView={isAnalyticsView}>
        <SecsTimer {...props} />
      </TimeLeft>
      <ProgressBarWrapper isAnalyticsView={isAnalyticsView}>
        <TimeProgress {...props} />
      </ProgressBarWrapper>
      <RejectQuoteButton
        data-testid="rfqReject"
        isAnalyticsView={isAnalyticsView}
        onClick={() => onRejectQuote(symbol)}
      >
        Reject
      </RejectQuoteButton>
    </TimerWrapper>
  )
}
