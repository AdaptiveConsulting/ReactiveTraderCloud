import { RfqState } from "@/generated/TradingGateway"
import { cancelCreditRfq$ } from "@/services/credit"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { exhaustMap } from "rxjs/operators"
import { rfqStateToLabel } from "../../common"
import { CreditTimer } from "../../CreditTimer"
import { CancelQuoteButton, CardFooterWrapper, CardState } from "./styled"

interface CardFooterProps {
  rfqId: number
  state: RfqState
  start: number
  end: number
}

const [cancelRfq$, onCancelRfq] = createSignal<number>()

cancelRfq$.pipe(exhaustMap((rfqId) => cancelCreditRfq$({ rfqId }))).subscribe()

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
          <CreditTimer start={start} end={end} isSellSideView={false} />
          <CancelQuoteButton onClick={() => onCancelRfq(rfqId)}>
            Cancel
          </CancelQuoteButton>
        </>
      ) : (
        <CardState accepted={state === RfqState.Closed}>
          {rfqStateToLabel(state)}
        </CardState>
      )}
    </CardFooterWrapper>
  )
}
