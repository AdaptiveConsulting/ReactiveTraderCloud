import { RfqState } from "@/generated/TradingGateway"
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
