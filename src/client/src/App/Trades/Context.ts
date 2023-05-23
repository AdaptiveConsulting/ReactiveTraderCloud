import { createContext, useContext } from "react"
import { Observable } from "rxjs"

import { CompositeTrade } from "@/services/trades/types"

import { ColDef } from "./TradesState"

export const TradesStreamContext =
  createContext<Observable<CompositeTrade[]> | undefined>(undefined)

export const useTrades$ = () => {
  const trades$ = useContext(TradesStreamContext)

  if (!trades$) throw new Error("No trades stream provided")

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

export const HighlightedRowContext =
  createContext<number | null | undefined>(null)

export const useHighlightedRow = () => {
  const highlightedRow = useContext(HighlightedRowContext)

  return highlightedRow
}
