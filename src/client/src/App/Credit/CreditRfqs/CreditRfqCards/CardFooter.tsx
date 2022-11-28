import { QuoteState, RfqState } from "@/generated/TradingGateway"
import {
  cancelCreditRfq$,
  removeRfqs,
  RfqDetails,
  useCreditDealerById,
} from "@/services/credit"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { FaCheckCircle, FaTrash } from "react-icons/fa"
import { exhaustMap } from "rxjs/operators"
import { rfqStateToLabel } from "../../common"
import { CreditTimer } from "../../CreditTimer"
import { handleViewTrade } from "./handleViewTrade"
import {
  AcceptedCardState,
  CancelQuoteButton,
  CardFooterWrapper,
  TerminatedCardState,
  ViewTrade,
} from "./styled"

const [cancelRfq$, onCancelRfq] = createSignal<number>()

cancelRfq$.pipe(exhaustMap((rfqId) => cancelCreditRfq$({ rfqId }))).subscribe()

export const LiveFooterContent: FC<{
  rfqId: number
  start: number
  end: number
}> = ({ rfqId, start, end }) => (
  <>
    <CreditTimer start={start} end={end} isSellSideView={false} />
    <CancelQuoteButton onClick={() => onCancelRfq(rfqId)}>
      Cancel
    </CancelQuoteButton>
  </>
)

export const AcceptedFooterContent: FC<{
  rfqId: number
  acceptedDealerId?: number
}> = ({ rfqId, acceptedDealerId }) => {
  const dealerName =
    useCreditDealerById(acceptedDealerId!)?.name ?? "Unknown Dealer"

  return (
    <>
      <AcceptedCardState>
        <FaCheckCircle size={16} />
        You traded with {dealerName}
      </AcceptedCardState>
      <ViewTrade
        onClick={() => {
          handleViewTrade(rfqId.toString())
        }}
      >
        View Trade {rfqId}
      </ViewTrade>
    </>
  )
}

export const TerminatedFooterContent: FC<{ rfqId: number; state: RfqState }> =
  ({ rfqId, state }) => (
    <TerminatedCardState onClick={() => removeRfqs([rfqId])}>
      <FaTrash size={12} />
      {rfqStateToLabel(state)}
    </TerminatedCardState>
  )

export const CardFooter: FC<{ rfqDetails: RfqDetails }> = ({
  rfqDetails: { id, quotes, state, creationTimestamp, expirySecs },
}) => {
  const acceptedDealerId = quotes.find(
    (quote) => quote.state === QuoteState.Accepted,
  )?.dealerId

  return (
    <CardFooterWrapper>
      {state === RfqState.Open ? (
        <LiveFooterContent
          rfqId={id}
          start={Number(creationTimestamp)}
          end={Number(creationTimestamp) + expirySecs * 1000}
        />
      ) : state === RfqState.Closed ? (
        <AcceptedFooterContent rfqId={id} acceptedDealerId={acceptedDealerId} />
      ) : (
        <TerminatedFooterContent rfqId={id} state={state} />
      )}
    </CardFooterWrapper>
  )
}
