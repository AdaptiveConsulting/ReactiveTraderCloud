import { RfqState } from "@/generated/TradingGateway"
import { cancelCreditRfq$ } from "@/services/credit"
import { createSignal } from "@react-rxjs/utils"
import { FC, useLayoutEffect, useState } from "react"
import { exhaustMap } from "rxjs/operators"
import {
  ProgressBar,
  CardFooterWrapper,
  ProgressBarWrapper,
  CancelQuoteButton,
  CardState,
  TimeLeft,
} from "./styled"

const SecsTimer: React.FC<{ end: number }> = ({ end }) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.round((end - Date.now()) / 1000),
  )
  useLayoutEffect(() => {
    if (timeLeft === 0) return
    const token = setTimeout(
      () => setTimeLeft((x) => x - 1),
      end - (timeLeft - 1) * 1000 - Date.now(),
    )
    return () => clearTimeout(token)
  }, [timeLeft, end])

  const timeLeftMins = Math.trunc(timeLeft / 60)
  const timeLeftSecs = timeLeft % 60

  return (
    <>
      {timeLeftMins}M {timeLeftSecs}S
    </>
  )
}

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

interface CardFooterProps {
  rfqId: number
  state: RfqState
  start: number
  end: number
}

const [cancelRfq$, onCancelRfq] = createSignal<number>()

cancelRfq$.pipe(exhaustMap((rfqId) => cancelCreditRfq$({ rfqId }))).subscribe()

const getRfqStateText = (rfqState: string) =>
  rfqState === RfqState.Closed ? "Done" : rfqState

export const CardFooter: FC<CardFooterProps> = ({
  rfqId,
  state,
  start,
  end,
}) => {
  return (
    <CardFooterWrapper>
      {state === RfqState.Open ? (
        <>
          <TimeLeft>
            <SecsTimer end={end} />
          </TimeLeft>
          <ProgressBarWrapper>
            <TimeProgress start={start} end={end} />
          </ProgressBarWrapper>
          <CancelQuoteButton onClick={() => onCancelRfq(rfqId)}>
            Cancel
          </CancelQuoteButton>
        </>
      ) : (
        <CardState accepted={state === RfqState.Closed}>
          {getRfqStateText(state)}
        </CardState>
      )}
    </CardFooterWrapper>
  )
}
