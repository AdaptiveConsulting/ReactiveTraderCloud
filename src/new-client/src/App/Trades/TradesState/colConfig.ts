import { Trade } from "services/trades"
import { capitalize } from "utils/capitalize"
import { format as formatDate } from "date-fns"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
} from "utils/formatNumber"

export type ColField = keyof Trade

type FilterType = "set" | "date" | "number"

export interface ColConfig {
  headerName: string
  filterType: FilterType
  valueFormatter?: (val: unknown) => string
}

export const DATE_FORMAT = "dd-MMM-yyyy"

const formatTo6Digits = significantDigitsNumberFormatter(6)

export const colConfigs: Record<ColField, ColConfig> = {
  tradeId: {
    headerName: "Trade ID",
    filterType: "number",
  },
  status: {
    headerName: "Status",
    filterType: "set",
    valueFormatter: capitalize,
  },
  tradeDate: {
    headerName: "Trade Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
  },
  direction: {
    headerName: "Direction",
    filterType: "set",
  },
  symbol: {
    headerName: "CCYCCY",
    filterType: "set",
  },
  dealtCurrency: {
    headerName: "Deal CCY",
    filterType: "set",
  },
  notional: {
    headerName: "Notional",
    filterType: "number",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
  },
  spotRate: {
    headerName: "Rate",
    filterType: "number",
    valueFormatter: (v) => formatTo6Digits(v as number),
  },
  valueDate: {
    headerName: "Value Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
  },
  traderName: {
    headerName: "Trader",
    filterType: "set",
  },
}

export const colFields: ColField[] = Object.keys(colConfigs) as ColField[]
