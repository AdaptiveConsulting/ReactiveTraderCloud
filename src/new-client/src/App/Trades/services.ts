import { bind } from "@react-rxjs/core"
import { combineLatest, Subject } from "rxjs"
import { map, scan, startWith } from "rxjs/operators"
import { trades$ } from "services/trades"
import { ColField } from "./TradesGrid"

type SortDirection = "ASC" | "DESC"

class TableSort {
  constructor(public direction?: SortDirection, public field?: ColField) {}
}

export const sortFieldSelections$ = new Subject<ColField>()

const descDefaultFields = new Set<ColField>([
  "tradeDate",
  "valueDate",
  "tradeId",
])

export const [useTableSort, tableSort$] = bind(
  sortFieldSelections$.pipe(
    scan((tableSort, sortFieldSelection) => {
      if (tableSort.field === sortFieldSelection) {
        if (
          descDefaultFields.has(sortFieldSelection) &&
          tableSort.direction === "DESC"
        ) {
          return new TableSort("ASC", sortFieldSelection)
        } else if (
          !descDefaultFields.has(sortFieldSelection) &&
          tableSort.direction === "ASC"
        ) {
          return new TableSort("DESC", sortFieldSelection)
        } else {
          return new TableSort()
        }
      }

      return new TableSort(
        descDefaultFields.has(sortFieldSelection) ? "DESC" : "ASC",
        sortFieldSelection,
      )
    }, new TableSort()),
    startWith(new TableSort()),
  ),
)

const numericComparator = (direction: SortDirection, a: number, b: number) => {
  return direction === "ASC" ? a - b : b - a
}

const stringComparator = (direction: SortDirection, a: string, b: string) => {
  if (a > b) {
    return direction === "ASC" ? 1 : -1
  } else if (a < b) {
    return direction === "ASC" ? -1 : 1
  } else {
    return 0
  }
}

export const [useTableTrades, tableTrades$] = bind(
  combineLatest([trades$, tableSort$]).pipe(
    map(([trades, { field, direction }]) => {
      const sortedTrades = [...trades]
      if (field && direction) {
        sortedTrades.sort((tradeA, tradeB) => {
          const aSortFieldValue = tradeA[field]
          const bSortFieldValue = tradeB[field]

          if (
            aSortFieldValue instanceof Date &&
            bSortFieldValue instanceof Date
          ) {
            return numericComparator(
              direction,
              aSortFieldValue.valueOf(),
              bSortFieldValue.valueOf(),
            )
          }

          if (
            typeof aSortFieldValue === "number" &&
            typeof bSortFieldValue === "number"
          ) {
            return numericComparator(
              direction,
              aSortFieldValue,
              bSortFieldValue,
            )
          }

          if (
            typeof aSortFieldValue === "string" &&
            typeof bSortFieldValue === "string"
          ) {
            return stringComparator(
              direction,
              aSortFieldValue.toLowerCase(),
              bSortFieldValue.toLowerCase(),
            )
          }

          throw new Error(
            "Trade sort for table received value of unexpected type",
          )
        })
      }
      return sortedTrades
    }),
  ),
)
