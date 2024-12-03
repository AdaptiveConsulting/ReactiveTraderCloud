import { createContext, useContext } from "react"
import { Observable } from "rxjs"

import { useSafeContext } from "@/client/utils/useSafeContext"
import { TradeType } from "@/services/trades/types"

import { ColDef } from "./TradesState"

export const TradesStreamContext = createContext<
  Observable<TradeType[]> | undefined
>(undefined)

export const useTrades$ = () =>
  useSafeContext(TradesStreamContext, "No trades stream provided")

export const ColDefContext = createContext<ColDef | undefined>(undefined)

export const useColDef = () =>
  useSafeContext(ColDefContext, "No Column definition provided")

export const ColFieldsContext = createContext<(string | number)[] | undefined>(
  undefined,
)

export const useColFields = () =>
  useSafeContext(ColFieldsContext, "No Column fields provided")

export const HighlightedRowContext = createContext<number | null | undefined>(
  null,
)

export const useHighlightedRow = () => useContext(HighlightedRowContext)
