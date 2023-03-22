import { ReactElement, useEffect, useState } from "react"

import { capitalize, formatAsWholeNumber, THOUSANDS_SEPARATOR } from "@/utils"

import { SecsTimer } from "../../common"
import { RfqRowKey } from "./SellSideRfqGrid"

export type ColKey = Exclude<RfqRowKey, "id">

export type RfqColDef = Record<ColKey, ColConfig>

export type FilterType = "set" | "date" | "number"

type ValueFormatter = (val: unknown) => string | ReactElement

/**
 * All of these values are configured centrally because
 * they are used together in multiple places:
 *
 * grid body, grid header, grid export
 *
 * headerName - display name for the column field key
 * filterType - type of filter predicate that applies to the column
 * valueFormatter - how to display the field values in the column
 * excelValueFormatter - if defined, overwrites valueFormatter when exporting to Excel/CSV
 * width - needed to keep header/body cells same width
 */
export interface ColConfig {
  headerName: string
  filterType: FilterType
  valueFormatter?: ValueFormatter
  excelValueFormatter?: ValueFormatter
  width: number
  align?: "left" | "right"
}

export const DATE_FORMAT = "dd-MMM-yyyy"

const notionalExcelValueFormatter: ValueFormatter = (v) =>
  formatAsWholeNumber(v as number).replaceAll(THOUSANDS_SEPARATOR, "")

const StatefulTimer = ({ end }: { end?: number }) => {
  const [timerEnded, setTimerEnded] = useState(end ? Date.now() >= end : true)

  useEffect(() => {
    if (!timerEnded) {
      const id = setInterval(() => {
        if (end === undefined || Date.now() >= end) {
          setTimerEnded(true)
        }
      }, 1000)
      return () => clearInterval(id)
    }
  }, [timerEnded, end])

  return timerEnded || end === undefined ? (
    <span />
  ) : (
    <SecsTimer grid end={end} />
  )
}

export const rfqColDef: RfqColDef = {
  status: {
    headerName: "Status",
    filterType: "set",
    valueFormatter: capitalize,
    width: 100,
  },
  direction: {
    headerName: "DIR",
    filterType: "set",
    width: 10,
  },
  cpy: {
    headerName: "Cpy",
    filterType: "set",
    width: 10,
  },
  security: {
    headerName: "Security",
    filterType: "set",
    width: 150,
  },
  quantity: {
    headerName: "Quantity",
    filterType: "number",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    excelValueFormatter: notionalExcelValueFormatter,
    width: 10,
  },
  price: {
    headerName: "Price",
    filterType: "number",
    valueFormatter: (v) => `$${v}`,
    excelValueFormatter: (v) => `${v}`,
    width: 10,
  },
  timer: {
    headerName: "Timer",
    filterType: "number",
    width: 60,
    valueFormatter: (v) => {
      return <StatefulTimer end={v as number} />
    },
  },
}

export const rfqColFields = Object.keys(rfqColDef) as RfqRowKey[]
