import { broadcast } from "@finos/fdc3"
import { useCallback } from "react"

import { FxTrade, trades$ } from "@/services/trades"

import { TradesGrid } from "./TradesGrid"
import { useFxTradeRowHighlight } from "./TradesState"
import { fxColDef, fxColFields } from "./TradesState/colConfig"

if (window.fdc3) {
  window.fdc3.addIntentListener("ViewChart", (e) => {
    console.debug("ViewChart intent received", e)
  })
}

const FxTrades = () => {
  const highlightedRow = useFxTradeRowHighlight()

  const tryBroadcastContext = useCallback((trade: FxTrade) => {
    const context = {
      type: "fdc3.instrument",
      id: { ticker: trade.symbol },
    }
    if (window.fdc3) {
      broadcast(context)
      window.fdc3.raiseIntent("ViewChart", context)
    }
  }, [])

  const isRejected = useCallback(
    (row: FxTrade) => row.status === "Rejected",
    [],
  )

  return (
    <TradesGrid
      caption="Reactive Trader FX Trades Table"
      highlightedRow={highlightedRow}
      columnDefinitions={fxColDef}
      columnFields={fxColFields}
      trades$={trades$}
      isRejected={isRejected}
      onRowClick={tryBroadcastContext}
      section="blotter"
      showHeaderTools
    />
  )
}

export default FxTrades
