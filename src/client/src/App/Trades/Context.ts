import { Trade } from "@/services/trades"
import { createContext, useContext } from "react"
import { Observable } from "rxjs"
import { ColDef } from "./TradesState"

export const Trades$Context =
  createContext<Observable<Trade[]> | undefined>(undefined)

export const useTrades$ = () => {
  const trades$ = useContext(Trades$Context)

  if (!trades$) throw new Error("No trades stream found")

  return trades$
}

export const ColDefContext = createContext<ColDef | undefined>(undefined)

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
