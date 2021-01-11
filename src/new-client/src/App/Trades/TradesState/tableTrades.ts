import { bind } from "@react-rxjs/core"
import { combineLatest } from "rxjs"
import { map } from "rxjs/operators"
import { Trade, trades$ } from "services/trades"
import { ColField } from "./colConfig"
import { quickFilterInputs$, appliedFilterEntries$ } from "./filterState"
import { SortDirection, tableSort$ } from "./sortState"

const searchTrueOfTrade = (searchTerms: string[], tradeValues: unknown[]) => {
  return searchTerms.every((term) =>
    tradeValues.some((value) =>
      (value instanceof Date ? value.toString() : String(value))
        .toLowerCase()
        .includes(term),
    ),
  )
}

const filterTrueOfTrade = (
  appliedFilters: [string, Set<unknown>][],
  trade: Trade,
) => {
  return appliedFilters.every(([field, filterValues]) => {
    return (filterValues as Set<unknown>).has(trade[field as ColField])
  })
}

const filteredTrades$ = combineLatest([
  trades$,
  quickFilterInputs$.pipe(
    map((quickFilterInputs) => quickFilterInputs.split(" ")),
  ),
  appliedFilterEntries$,
]).pipe(
  map(([trades, searchTerms, appliedFilters]) => {
    const haveAppliedFilters = appliedFilters.length > 0
    const haveSearchTerms = searchTerms.length > 0

    if (!haveSearchTerms && !haveAppliedFilters) {
      return trades
    }

    return trades.filter((trade) => {
      const tradeValues = Object.values(trade)
      if (!haveAppliedFilters) {
        return searchTrueOfTrade(searchTerms, tradeValues)
      } else if (!haveSearchTerms) {
        return filterTrueOfTrade(appliedFilters, trade)
      } else {
        return (
          searchTrueOfTrade(searchTerms, tradeValues) &&
          filterTrueOfTrade(appliedFilters, trade)
        )
      }
    })
  }),
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
  combineLatest([filteredTrades$, tableSort$]).pipe(
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
