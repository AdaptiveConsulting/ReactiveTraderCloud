import { Direction } from "generated/TradingGateway"

export function invertDirection(direction: Direction): Direction {
  return direction === Direction.Buy ? Direction.Sell : Direction.Buy
}
