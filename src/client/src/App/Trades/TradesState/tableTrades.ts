import { HIGHLIGHT_ROW_FLASH_TIME } from "@/constants"
import { CreditTrade, creditTrades$, FxTrade, trades$ } from "@/services/trades"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { startOfDay } from "date-fns"
import { combineLatest, merge, Observable } from "rxjs"
import { delay, filter, map, mergeMap, scan, startWith } from "rxjs/operators"
import { ColDef } from "./colConfig"
import type { DateFilterContent, NumFilterContent } from "./filterState"
import {
  ComparatorType,
  getAppliedSetFilterEntries,
  getDateFilterEntries,
  getNumFilterEntries,
  quickFilterInputs$,
} from "./filterState"
import type { SortDirection, TableSort } from "./sortState"
import { tableSort$ } from "./sortState"

type Trade = FxTrade | CreditTrade

/**
 *
 * @param searchTerms
 * @param tradeValues
 * @returns
 *
 * Predicate that tests whether trade/row satisfies QuickFilter.
 *
 * Trade/row satisfies QuickFilter just in case for every search
 * term in the filter, the trade/row has a field that includes it
 */
const searchTrueOfTrade = (searchTerms: string[], tradeValues: unknown[]) => {
  return searchTerms.every((term) =>
    tradeValues.some((value) =>
      (value instanceof Date ? value.toString() : String(value))
        .toLowerCase()
        .includes(term),
    ),
  )
}

/**
 *
 * @param appliedFilters
 * @param trade
 * @returns
 *
 * Predicate that tests whether trade/row satisfies
 * currently selected column "set" filters (multi-select
 * dropdowns).
 *
 * Trade/row satisfies currently selected column set filters
 * just in case, for every column with applied filters, the
 * trade/row's field is in that set of filters.
 */
const setFiltersTrueOfTrade = (
  appliedFilters: [string, Set<unknown>][],
  trade: Trade,
) => {
  return appliedFilters.every(([field, filterValues]) => {
    return (filterValues as Set<unknown>).has(trade[field])
  })
}

/**
 *
 * @param val
 * @returns
 *
 * Type guard for number columns
 */
const numIsSet = (val: number | undefined | null): val is number => {
  return val != null
}

/**
 *
 * @param val
 * @returns
 *
 * Type guard for date columns
 */
const dateIsSet = (val: Date | undefined | null): val is Date => {
  return val != null
}

/**
 *
 * @param dateFilters
 * @param trade
 * @returns
 *
 * Predicate that tests whether trade/row satisfies
 * currently selected date filter.
 */
const dateFiltersTrueOfTrade = (
  dateFilters: [string, DateFilterContent][],
  trade: Trade,
) => {
  return dateFilters.every(([field, filterContent]) => {
    // Predicate is trivially true if no date filter is set
    if (!dateIsSet(filterContent.value1)) {
      return true
    }

    // Normalize datetimes to start of day and take
    // Unix/numerical representation for simple comparisons.
    const tradeDate = startOfDay(trade[field] as Date).valueOf()
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

/**
 *
 * @param numFilters
 * @param trade
 * @returns
 *
 * Predicate that tests whether trade/row satisfies
 * currently selected number filter.
 */
const numFiltersTrueOfTrade = (
  numFilters: [string, NumFilterContent][],
  trade: Trade,
) => {
  return numFilters.every(([field, filterContent]) => {
    // Predicate is trivially true if no number filter is set
    if (!numIsSet(filterContent.value1)) {
      return true
    }

    const tradeValue = trade[field]
    const tradeNumber =
      typeof tradeValue === "number"
        ? tradeValue
        : parseFloat(tradeValue as string)
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

const getFilteredTrades = <T extends Trade>(
  trades$: Observable<T[]>,
  colDef: ColDef,
) => {
  return combineLatest([
    trades$,
    quickFilterInputs$.pipe(
      startWith(""),
      map((quickFilterInputs) => quickFilterInputs.split(" ")),
    ),
    getAppliedSetFilterEntries(trades$, colDef),
    getNumFilterEntries(colDef),
    getDateFilterEntries(colDef),
  ]).pipe(
    map(([trades, searchTerms, setFilters, numFilters, dateFilters]) => {
      const haveSetFilters = setFilters.length > 0
      const haveSearchTerms = searchTerms.length > 0
      const haveNumFilters = numFilters.length > 0
      const haveDateFilters = dateFilters.length > 0

      // No filters applied
      if (
        !haveSearchTerms &&
        !haveSetFilters &&
        !haveNumFilters &&
        !haveDateFilters
      ) {
        return trades
      }

      // Trade is included if it either satisfies every
      // filter-type predicate applied to it or has no
      // filters of that type applied.
      return trades.filter((trade: Trade) => {
        const numFiltersTrue =
          !haveNumFilters || numFiltersTrueOfTrade(numFilters, trade)
        const setFiltersTrue =
          !haveSetFilters || setFiltersTrueOfTrade(setFilters, trade)
        const searchTrue =
          !haveSearchTerms ||
          searchTrueOfTrade(searchTerms, Object.values(trade))
        const dateFiltersTrue =
          !haveDateFilters || dateFiltersTrueOfTrade(dateFilters, trade)
        return numFiltersTrue && setFiltersTrue && searchTrue && dateFiltersTrue
      })
    }),
  )
}

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

/**
 *
 * @param param0
 * @returns
 *
 * Function that sorts trades based on the current
 * sort field and direction.
 *
 * Checks runtime type of column field to determine
 * which sort comparator to use.
 */
const sortTrades = ([trades, { field, direction }]: [
  Trade[],
  TableSort<keyof Trade>,
]): Trade[] => {
  const sortedTrades = [...trades]
  if (field && direction) {
    sortedTrades.sort((tradeA, tradeB) => {
      const aSortFieldValue = tradeA[field]
      const bSortFieldValue = tradeB[field]

      if (aSortFieldValue instanceof Date && bSortFieldValue instanceof Date) {
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
        return numericComparator(direction, aSortFieldValue, bSortFieldValue)
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

      throw new Error("Trade sort for table received value of unexpected type")
    })
  }
  return sortedTrades
}

/**
 * Stream and state hook that represent the current
 * set of trades in the grid, ordered by the current
 * sort.
 */
export const [useTableTrades, tableTrades$] = bind(
  (trades$: Observable<Trade[]>, colDef: ColDef) => {
    return combineLatest([getFilteredTrades(trades$, colDef), tableSort$]).pipe(
      map(sortTrades),
    )
  },
  [],
)

/**
 * State hook that emits an array of the
 * current column fields that have column filters
 * applied to them.  Consumed by the TradesHeader
 * to allow quick unsetting of the filters on
 * each column.
 */
export const [useFilterFields] = bind(
  <T extends Trade>(trades$: Observable<T[]>, colDef: ColDef) =>
    combineLatest([
      getAppliedSetFilterEntries(trades$, colDef).pipe(startWith([])),
      getNumFilterEntries(colDef).pipe(startWith([])),
      getDateFilterEntries(colDef).pipe(startWith([])),
    ]).pipe(
      map(([set, num, date]) =>
        [...set, ...num, ...date].map(([field]) => field),
      ),
    ),
  [],
)

/**
 * Signal to capture a tradeId of row to highlight in FX blotter
 */
export const [fxTradeRowHighlight$, setFxTradeRowHighlight] =
  createSignal<string>()

/**
 * Signal to capture a tradeId of row to highlight in Credit blotter
 */
export const [creditTradeRowHighlight$, setCreditTradeRowHighlight] =
  createSignal<string>()

/**
 * Emit tradeId of new trades after the initial load
 */
const newTradeId$ = merge(trades$, creditTrades$).pipe(
  scan(
    (acc, trades) => {
      return {
        stateOfWorld: acc.stateOfWorld && acc.trades.length === 0,
        trades: trades,
        skip: acc.trades.length === trades.length,
      }
    },
    { stateOfWorld: true, trades: [], skip: false } as {
      stateOfWorld: boolean
      trades: Trade[]
      skip: boolean
    },
  ),
  filter(
    ({ stateOfWorld, trades, skip }) =>
      !stateOfWorld && trades.length > 0 && !skip,
  ),
  map(({ trades }) => trades[0].tradeId),
)

/**
 * State hook that emits tradeId of row to highlight for x seconds
 * highlighted row will be either from manually updating tradeRowHighlight$ or a new trade
 */

export const [useFxTradeRowHighlight] = bind(
  merge([
    fxTradeRowHighlight$,
    fxTradeRowHighlight$.pipe(
      delay(HIGHLIGHT_ROW_FLASH_TIME),
      map(() => undefined),
    ),
    newTradeId$,
    newTradeId$.pipe(
      delay(HIGHLIGHT_ROW_FLASH_TIME),
      map(() => undefined),
    ),
  ]).pipe(mergeMap((tradeId) => tradeId)),
  null,
)

export const [useCreditTradeRowHighlight] = bind(
  merge([
    creditTradeRowHighlight$,
    creditTradeRowHighlight$.pipe(
      delay(HIGHLIGHT_ROW_FLASH_TIME),
      map(() => undefined),
    ),
    newTradeId$,
    newTradeId$.pipe(
      delay(HIGHLIGHT_ROW_FLASH_TIME),
      map(() => undefined),
    ),
  ]).pipe(mergeMap((tradeId) => tradeId)),
  null,
)
