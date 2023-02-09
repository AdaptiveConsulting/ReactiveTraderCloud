import { Direction, RfqState } from "@/generated/TradingGateway"

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
