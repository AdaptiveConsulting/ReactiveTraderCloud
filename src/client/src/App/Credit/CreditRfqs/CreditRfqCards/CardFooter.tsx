import { RfqState } from "@/generated/TradingGateway"
import { cancelCreditRfq$ } from "@/services/credit"
import { createSignal } from "@react-rxjs/utils"
import { FC, useLayoutEffect, useRef, useState } from "react"
import { exhaustMap } from "rxjs/operators"
import {
  CancelQuoteButton,
  CardFooterWrapper,
  CardState,
  ProgressBar,
  ProgressBarWrapper,
  TimeLeft,
} from "./styled"

const SecsTimer: React.FC<{ end: number }> = ({ end }) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.round((end - Date.now()) / 1000),
  )
  const expired = timeLeft <= 0
  useLayoutEffect(() => {
    if (!expired) {
      const id = setInterval(() => {
        setTimeLeft((x) => x - 1)
      }, 1000)
      return () => clearInterval(id)
    }
  }, [expired])

  const timeLeftMins = Math.trunc(timeLeft / 60)
  const timeLeftSecs = timeLeft % 60

  return (
    <>
      {timeLeftMins}M {timeLeftSecs}S
    </>
  )
}

const TimeProgress: React.FC<{
  start: number
  end: number
}> = ({ start, end }) => {
  const transitionTime = useRef(end - Date.now())
  const startgWidthPercentage = useRef(
    ((end - Date.now()) / (end - start)) * 100,
  )

  return (
    <ProgressBar
      transitionTime={transitionTime.current}
      start={startgWidthPercentage.current}
      end={0}
    />
  )
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
