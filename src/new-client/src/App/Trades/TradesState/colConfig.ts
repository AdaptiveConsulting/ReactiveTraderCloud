import type { Trade } from "services/trades"
import { format as formatDate } from "date-fns"
import {
  mapObject,
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
  capitalize,
} from "utils"

export type ColField = keyof Trade

export type FilterType = "set" | "date" | "number"
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

export const colFilterMap = mapObject(colConfigs, (val) => val.filterType)

export const colFields: ColField[] = Object.keys(colConfigs) as ColField[]
