import { useEffect } from "react"

import {
  registerCreditQuoteAcceptedNotifications,
  unregisterCreditQuoteAcceptedNotifications,
} from "@/client/notifications"
import { creditTrades$ } from "@/services/trades"

import { TradesGrid } from "./TradesGrid"
import { useCreditTradeRowHighlight } from "./TradesState"
import { creditColDef, creditColFields } from "./TradesState/colConfig"

const CreditTrades = () => {
  const highlightedRow = useCreditTradeRowHighlight()
  useEffect(() => {
    registerCreditQuoteAcceptedNotifications()

    return () => {
      unregisterCreditQuoteAcceptedNotifications()
    }
  }, [])
  return (
    <TradesGrid
      caption="Reactive Trader Credit Trades Table"
      highlightedRow={highlightedRow}
      columnDefinitions={creditColDef}
      columnFields={creditColFields}
      trades$={creditTrades$}
      section="creditBlotter"
      showHeaderTools
    />
  )
}

export default CreditTrades
