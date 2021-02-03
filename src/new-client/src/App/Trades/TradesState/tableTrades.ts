import { startOfDay } from "date-fns"
import { combineLatest } from "rxjs"
import { map, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import type { Trade } from "services/trades"
import { trades$ } from "services/trades"
import type { ColField } from "./colConfig"
import type {
  NumColField,
  DateColField,
  DateFilterContent,
  NumFilterContent,
} from "./filterState"
import {
  quickFilterInputs$,
  appliedSetFilterEntries$,
  numFilterEntries$,
  ComparatorType,
  dateFilterEntries$,
} from "./filterState"
import type { SortDirection } from "./sortState"
import { tableSort$ } from "./sortState"

const searchTrueOfTrade = (searchTerms: string[], tradeValues: unknown[]) => {
  return searchTerms.every((term) =>
    tradeValues.some((value) =>
      (value instanceof Date ? value.toString() : String(value))
        .toLowerCase()
        .includes(term),
    ),
  )
}

const setFiltersTrueOfTrade = (
  appliedFilters: [string, Set<unknown>][],
  trade: Trade,
) => {
  return appliedFilters.every(([field, filterValues]) => {
    return (filterValues as Set<unknown>).has(trade[field as ColField])
  })
}

const numIsSet = (val: number | undefined | null): val is number => {
  return val != null
}

const dateIsSet = (val: Date | undefined | null): val is Date => {
  return val != null
}

const dateFiltersTrueOfTrade = (
  dateFilters: [string, DateFilterContent][],
  trade: Trade,
) => {
  return dateFilters.every(([field, filterContent]) => {
    if (!dateIsSet(filterContent.value1)) {
      return true
    }

    const tradeDate = startOfDay(trade[field as DateColField]).valueOf()
    const filterDate = startOfDay(filterContent.value1).valueOf()

    switch (filterContent.comparator) {
      case ComparatorType.Equals:
        return tradeDate === filterDate
      case ComparatorType.NotEqual:
        return tradeDate !== filterDate
      case ComparatorType.Less:
        return tradeDate < filterDate
      case ComparatorType.LessOrEqual:
        return tradeDate <= filterDate
      case ComparatorType.Greater:
        return tradeDate > filterDate
      case ComparatorType.GreaterOrEqual:
        return tradeDate >= filterDate
      case ComparatorType.InRange:
        return (
          dateIsSet(filterContent.value2) &&
          tradeDate >= filterDate &&
          tradeDate <= startOfDay(filterContent.value2).valueOf()
        )
      default:
        return true
    }
  })
}

const numFiltersTrueOfTrade = (
  numFilters: [string, NumFilterContent][],
  trade: Trade,
) => {
  return numFilters.every(([field, filterContent]) => {
    if (!numIsSet(filterContent.value1)) {
      return true
    }

    const tradeNumber = trade[field as NumColField]
    const filterNumber = filterContent.value1

    switch (filterContent.comparator) {
      case ComparatorType.Equals:
        return tradeNumber === filterNumber
      case ComparatorType.NotEqual:
        return tradeNumber !== filterNumber
      case ComparatorType.Less:
        return tradeNumber < filterNumber
      case ComparatorType.LessOrEqual:
        return tradeNumber <= filterNumber
      case ComparatorType.Greater:
        return tradeNumber > filterNumber
      case ComparatorType.GreaterOrEqual:
        return tradeNumber >= filterNumber
      case ComparatorType.InRange:
        return (
          numIsSet(filterContent.value2) &&
          tradeNumber >= filterNumber &&
          tradeNumber <= filterContent.value2
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
  appliedSetFilterEntries$,
  numFilterEntries$,
  dateFilterEntries$,
]).pipe(
  map(([trades, searchTerms, setFilters, numFilters, dateFilters]) => {
    const haveSetFilters = setFilters.length > 0
    const haveSearchTerms = searchTerms.length > 0
    const haveNumFilters = numFilters.length > 0
    const haveDateFilters = dateFilters.length > 0

    if (
      !haveSearchTerms &&
      !haveSetFilters &&
      !haveNumFilters &&
      !haveDateFilters
    ) {
      return trades
    }

    return trades.filter((trade) => {
      const numFiltersTrue =
        !haveNumFilters || numFiltersTrueOfTrade(numFilters, trade)
      const setFiltersTrue =
        !haveSetFilters || setFiltersTrueOfTrade(setFilters, trade)
      const searchTrue =
        !haveSearchTerms || searchTrueOfTrade(searchTerms, Object.values(trade))
      const dateFiltersTrue =
        !haveDateFilters || dateFiltersTrueOfTrade(dateFilters, trade)
      return numFiltersTrue && setFiltersTrue && searchTrue && dateFiltersTrue
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
export const [useFilterFields] = bind(
  combineLatest([
    appliedSetFilterEntries$.pipe(startWith([])),
    numFilterEntries$.pipe(startWith([])),
    dateFilterEntries$.pipe(startWith([])),
  ]).pipe(
    map(
      ([set, num, date]) =>
        [...set, ...num, ...date].map(([field]) => field) as ColField[],
    ),
  ),
  [] as ColField[],
)
