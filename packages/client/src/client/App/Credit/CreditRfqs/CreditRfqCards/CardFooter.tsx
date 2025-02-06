import { createSignal } from "@react-rxjs/utils"
import { exhaustMap } from "rxjs/operators"

import { Button } from "@/client/components/Button"
import { BinIcon } from "@/client/components/icons/BinIcon"
import { CheckCircleIcon } from "@/client/components/icons/CheckCircleIcon"
import { Typography } from "@/client/components/Typography"
import { ACCEPTED_QUOTE_STATE, RfqState } from "@/generated/TradingGateway"
import {
  cancelCreditRfq$,
  removeRfqs,
  useDealerNameById,
} from "@/services/credit"
import { RfqDetails } from "@/services/credit/creditRfqs"

import { CreditRfqTimer, rfqStateToLabel } from "../../common"
import { handleViewTrade } from "./handleViewTrade"
import { CardFooterWrapper, CloseRfqButton, ViewTradeButton } from "./styled"

const [cancelRfq$, onCancelRfq] = createSignal<number>()

cancelRfq$.pipe(exhaustMap((rfqId) => cancelCreditRfq$({ rfqId }))).subscribe()

export const LiveFooterContent = ({
  rfqId,
  start,
  end,
}: {
  rfqId: number
  start: number
  end: number
}) => (
  <>
    <CreditRfqTimer start={start} end={end} isSellSideView={false} />
    <Button variant="primary" size="xxs" onClick={() => onCancelRfq(rfqId)}>
      Cancel
    </Button>
  </>
)

export const AcceptedFooterContent = ({
  rfqId,
  acceptedDealerId,
}: {
  rfqId: number
  acceptedDealerId?: number
}) => {
  const dealerName = useDealerNameById(acceptedDealerId)

  return (
    <>
      {CheckCircleIcon}
      <Typography
        variant="Text xxs/Regular"
        color="Colors/Text/text-success-primary (600)"
      >
        You traded with {dealerName}
      </Typography>
      <ViewTradeButton
        onClick={() => {
          handleViewTrade(rfqId)
        }}
        data-testid="view-trade"
      >
        <Typography
          variant="Text xxs/Regular"
          color="Colors/Text/text-quaternary_on-brand"
        >
          View Trade {rfqId}
        </Typography>
      </ViewTradeButton>
    </>
  )
}

export const TerminatedFooterContent = ({
  rfqId,
  state,
}: {
  rfqId: number
  state: RfqState
}) => (
  <CloseRfqButton onClick={() => removeRfqs([rfqId])}>
    {BinIcon}
    <Typography
      variant="Text xxs/Regular"
      color="Colors/Text/text-secondary (700)"
    >
      {rfqStateToLabel(state)}
    </Typography>
  </CloseRfqButton>
)

export const CardFooter = ({
  rfqDetails: { id, quotes, state, creationTimestamp, expirySecs },
}: {
  rfqDetails: RfqDetails
}) => {
  const acceptedDealerId = quotes.find(
    (quote) => quote.state.type === ACCEPTED_QUOTE_STATE,
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
