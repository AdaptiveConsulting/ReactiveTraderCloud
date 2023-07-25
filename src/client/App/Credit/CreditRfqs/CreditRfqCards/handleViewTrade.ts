// this file exists because we need a different implementation for OpenFin
// see handleViewTrade.openfin.ts

import { setCreditTradeRowHighlight } from "@/client/App/Trades/TradesState"

export function handleViewTrade(rfqId: number) {
  setCreditTradeRowHighlight(rfqId)
}
