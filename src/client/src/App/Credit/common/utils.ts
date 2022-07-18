import { Direction, RfqState } from "@/generated/TradingGateway"

export function invertDirection(direction: Direction): Direction {
  return direction === Direction.Buy ? Direction.Sell : Direction.Buy
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
      return "Done"
    case RfqState.Cancelled:
      return "Canceled"
    default:
      return state
  }
}
