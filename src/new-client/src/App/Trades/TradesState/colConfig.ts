import { Trade } from "services/trades"
import { capitalize } from "utils/capitalize"
import { format as formatDate } from "date-fns"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
} from "utils/formatNumber"

export type ColField = keyof Trade
export type NumColField = keyof Pick<Trade, "tradeId" | "notional" | "spotRate">
export type SetColField = keyof Pick<
  Trade,
  "status" | "direction" | "symbol" | "dealtCurrency" | "traderName"
>
export type DateColField = keyof Pick<Trade, "tradeDate" | "valueDate">

type FilterType = "set" | "date" | "number"

export interface ColConfig {
  headerName: string
  filterType: FilterType
  valueFormatter?: (val: unknown) => string
  width: number
}

export const DATE_FORMAT = "dd-MMM-yyyy"

const formatTo6Digits = significantDigitsNumberFormatter(6)

export const colConfigs: Record<ColField, ColConfig> = {
  tradeId: {
    headerName: "Trade ID",
    filterType: "number",
    width: 100,
  },
  status: {
    headerName: "Status",
    filterType: "set",
    valueFormatter: capitalize,
    width: 110,
  },
  tradeDate: {
    headerName: "Trade Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 130,
  },
  direction: {
    headerName: "Direction",
    filterType: "set",
    width: 110,
  },
  symbol: {
    headerName: "CCYCCY",
    filterType: "set",
    width: 110,
  },
  dealtCurrency: {
    headerName: "Deal CCY",
    filterType: "set",
    width: 90,
  },
  notional: {
    headerName: "Notional",
    filterType: "number",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    width: 120,
  },
  spotRate: {
    headerName: "Rate",
    filterType: "number",
    valueFormatter: (v) => formatTo6Digits(v as number),
    width: 100,
  },
  valueDate: {
    headerName: "Value Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 120,
  },
  traderName: {
    headerName: "Trader",
    filterType: "set",
    width: 110,
  },
}

export const colFields: ColField[] = Object.keys(colConfigs) as ColField[]
