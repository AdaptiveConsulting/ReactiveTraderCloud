import { bind } from "@react-rxjs/core"
import { combineLatest } from "rxjs"
import { map } from "rxjs/operators"
import { Trade, trades$ } from "services/trades"
import { ColField } from "./colConfig"
import {
  quickFilterInputs$,
  appliedFilterEntries$,
  NumFilterContent,
  numFilterEntries$,
} from "./filterState"
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

const filterNumOfTrade = (
  numFilters: [string, NumFilterContent][],
  trade: Trade,
) => {
  return numFilters.every(([field, filterContent]) => {
    switch (filterContent.comparator) {
      case "Equals":
        return (
          filterContent.value1 &&
          trade[field as ColField] === filterContent.value1
        )
      case "NotEqual":
        return (
          filterContent.value1 &&
          trade[field as ColField] !== filterContent.value1
        )
      case "Less":
        return (
          filterContent.value1 &&
          trade[field as ColField] < filterContent.value1
        )
      case "LessOrEqual":
        return (
          filterContent.value1 &&
          trade[field as ColField] <= filterContent.value1
        )
      case "Greater":
        return (
          filterContent.value1 &&
          trade[field as ColField] > filterContent.value1
        )
      case "GreaterOrEqual":
        return (
          filterContent.value1 &&
          trade[field as ColField] >= filterContent.value1
        )
      case "InRange":
        return (
          filterContent.value1 &&
          filterContent.value2 &&
          trade[field as ColField] >= filterContent.value1 &&
          trade[field as ColField] <= filterContent.value2
        )
      default:
        return true
    }
  })
}

const filteredTrades$ = combineLatest([
  trades$,
  quickFilterInputs$.pipe(
    map((quickFilterInputs) => quickFilterInputs.split(" ")),
  ),
  appliedFilterEntries$,
  numFilterEntries$,
]).pipe(
  map(([trades, searchTerms, appliedFilters, numFilters]) => {
    const haveAppliedFilters = appliedFilters.length > 0
    const haveSearchTerms = searchTerms.length > 0
    const haveNumFilters = numFilters.length > 0

    if (!haveSearchTerms && !haveAppliedFilters && !haveNumFilters) {
      return trades
    }

    return trades.filter((trade) => {
      const tradeValues = Object.values(trade)
      let searchSelected = true
      let setSelected = true
      let numSelected = true
      if (haveNumFilters) {
        numSelected = filterNumOfTrade(numFilters, trade)
      }
      if (haveAppliedFilters) {
        setSelected = filterTrueOfTrade(appliedFilters, trade)
      }
      if (haveSearchTerms) {
        searchSelected = searchTrueOfTrade(searchTerms, tradeValues)
      }
      return setSelected && searchSelected && numSelected
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
