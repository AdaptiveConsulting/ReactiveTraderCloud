import { createContext, useContext } from "react"
import { Observable } from "rxjs"
import { RfqColDef } from "./colConfig"
import { RfqRow } from "./SellSideRfqGrid"

export const SellSellRfqStreamContext =
  createContext<Observable<RfqRow[]> | undefined>(undefined)

export const useSellSideRfqs$ = () => {
  const rfqs$ = useContext(SellSellRfqStreamContext)

  if (!rfqs$) throw new Error("No rfqs stream provided")

  return rfqs$
}

export const ColDefContext = createContext<RfqColDef | undefined>(undefined)

export const useColDef = () => {
  const colDef = useContext(ColDefContext)

  if (!colDef) throw Error("No Column definition provided")

  return colDef
}

export const ColFieldsContext =
  createContext<(string | number)[] | undefined>(undefined)

export const useColFields = () => {
  const colFields = useContext(ColFieldsContext)

  if (!colFields) throw Error("No Column fields provided")

  return colFields
}
