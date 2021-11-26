import type { Trade } from "@/services/trades"
import { format as formatDate } from "date-fns"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
  capitalize,
} from "@/utils"

export type ColField = keyof Trade

export type FilterType = "set" | "date" | "number"

/**
 * All of these values are configured centrally because
 * they are used together in multiple places:
 *
 * grid body, grid header, grid export
 *
 * headerName - display name for the column field / trade key
 * filterType - type of filter predicate that applies to the column
 * valueFormatter - how to display the field values in the column
 * width - needed to keep header/body cells same width
 */
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
    width: 8,
  },
  status: {
    headerName: "Status",
    filterType: "set",
    valueFormatter: capitalize,
    width: 8.8,
  },
  tradeDate: {
    headerName: "Trade Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 10.4,
  },
  direction: {
    headerName: "Direction",
    filterType: "set",
    width: 8.8,
  },
  symbol: {
    headerName: "CCYCCY",
    filterType: "set",
    width: 8.8,
  },
  dealtCurrency: {
    headerName: "Deal CCY",
    filterType: "set",
    width: 7.2,
  },
  notional: {
    headerName: "Notional",
    filterType: "number",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    width: 9.6,
  },
  spotRate: {
    headerName: "Rate",
    filterType: "number",
    valueFormatter: (v) => formatTo6Digits(v as number),
    width: 8,
  },
  valueDate: {
    headerName: "Value Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 9.6,
  },
  traderName: {
    headerName: "Trader",
    filterType: "set",
    width: 8.8,
  },
}

/**
 * Values of the Trade keys.  Used for dynamically constructing maps that
 * concern each key.
 */
export const colFields: ColField[] = Object.keys(colConfigs) as ColField[]
