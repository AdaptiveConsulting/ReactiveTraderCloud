import {
  AcceptedQuoteState,
  Direction,
  PendingWithPriceQuoteState,
  QuoteState,
  RejectedWithPriceQuoteState,
  RfqState,
} from "@/generated/TradingGateway"
import { RfqDetails } from "@/services/credit"

function getRfqRemainingTime(rfq: RfqDetails): number {
  return Date.now() - Number(rfq.creationTimestamp) + rfq.expirySecs * 1000
}

export function timeRemainingComparator(
  rfq1: RfqDetails,
  rfq2: RfqDetails,
): number {
  return getRfqRemainingTime(rfq1) - getRfqRemainingTime(rfq2)
}

export function isRfqTerminated(rfqState: RfqState): boolean {
  return rfqState === RfqState.Cancelled || rfqState === RfqState.Expired
}

export function isBuy(direction: Direction): boolean {
  return direction === Direction.Buy
}

export function isSell(direction: Direction): boolean {
  return direction === Direction.Sell
}

export function rfqStateToLabel(state: RfqState): string {
  switch (state) {
    case RfqState.Closed:
      return "You traded with Done"
    case RfqState.Cancelled:
      return "Request Canceled"
    default:
      return `Request ${state}`
  }
}

export const hasPrice = (
  quoteState: QuoteState | undefined,
): quoteState is
  | PendingWithPriceQuoteState
  | RejectedWithPriceQuoteState
  | AcceptedQuoteState => {
  return !!quoteState && "payload" in quoteState
}
