import { Direction } from "@/generated/TradingGateway"

import { isBuy } from "../App/Credit/common"

export function invertDirection(direction: Direction): Direction {
  return isBuy(direction) ? Direction.Sell : Direction.Buy
}
