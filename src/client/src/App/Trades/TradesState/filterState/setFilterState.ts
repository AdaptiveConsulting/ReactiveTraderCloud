import { map, mergeMap, scan, shareReplay, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createSignal, mergeWithKey } from "@react-rxjs/utils"
import { mapObject } from "@/utils"
import type { Trade } from "@/services/trades"
import { trades$ } from "@/services/trades"
import { colConfigs, colFields } from "../colConfig"
import type { FilterEvent } from "./filterCommon"
import { filterResets$ } from "./filterCommon"

/**
 * Subset of column fields (as type) that take set/multi-select filter-value
 * options.
 */
export type SetColField = keyof Pick<
  Trade,
  "status" | "direction" | "symbol" | "dealtCurrency" | "traderName"
>

/**
 * Subset of column fields (as values) that take set/multi-select filter-value
 * options.
 */
const setFields = colFields.filter(
  (field) => colConfigs[field].filterType === "set",
) as SetColField[]

export type DistinctValues = {
  [K in SetColField]: Set<Trade[K]>
}
interface ColFieldToggle<T extends SetColField> extends FilterEvent {
  value: Trade[T]
}

interface SearchInput extends FilterEvent {
  value: string
}

/**
 * Turns a filter-value option on a column on/off.
 *
 * ToDo: refactor into keyed signal
 */
const [colFilterToggle$, onColFilterToggle] = createSignal(
  <T extends SetColField>(field: T, value: Trade[T]) =>
    ({ field, value } as ColFieldToggle<T>),
)

/**
 * Captures search input on a column filter that functions
 * as a shortcut to unset/set multiple filter-value options.
 *
 * ToDo: refactor into keyed signal
 */
const [_si$, onSearchInput] = createSignal(
  <T extends SetColField>(field: T, value: string) =>
    ({ field, value } as SearchInput),
)

/**
 * Holds the input streams.  Persists state across
 * mounting/unmounting of the filter popup.
 */
const searchInputs$ = _si$.pipe(shareReplay())

export { onColFilterToggle, onSearchInput, searchInputs$ }

/**
 * Container for holding filter-value options--both
 * the universe of options and selected options.
 */
export const setFieldValuesContainer = Object.freeze(
  setFields.reduce((valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: new Set<Trade[typeof field]>(),
    }
  }, {} as DistinctValues),
)

/**
 *
 * @returns
 *
 * Filter-value options container factory.  Used primarily
 * for setting defaults.
 */
const createFilterValuesContainer = () =>
  mapObject(
    setFieldValuesContainer,
    (_, field) => new Set<Trade[typeof field]>(),
  )

/**
 * Stream that represents the distinct values
 * for every column field, stored as sets keyed
 * to each field.
 */
const distinctValues$ = trades$.pipe(
  map((trades) =>
    trades.reduce((distinctValues, trade) => {
      return mapObject(distinctValues, (fieldValues, fieldName) => {
        return new Set<Trade[typeof fieldName]>([
          trade[fieldName],
          ...fieldValues,
        ])
      })
    }, createFilterValuesContainer()),
  ),
)

/**
 * State hook and parametric stream of distinct values for each
 * column field.  Used to create universe of dropdown options in
 * SetFilterComponent.
 */
export const [useDistinctSetFieldValues, distinctSetFieldValues$] = bind(
  <T extends SetColField>(field: T) =>
    distinctValues$.pipe(map((distinctValues) => distinctValues[field])),
  new Set(),
)

/**
 * Stream of currently set filter-value options.
 *
 * Updated by three kinds events:
 *
 * searchInput - user types into filter popup
 * toggle - user sets/unsets individual filter-value option
 * reset - user clears column filter from grid header or
 * through "Selects All"
 *
 * "Select all" is modeled as no filter applied.
 */
const appliedSetFilters$ = mergeWithKey({
  searchInput: searchInputs$,
  toggle: colFilterToggle$,
  reset: filterResets$,
}).pipe(
  mergeMap((event) =>
    // merge necessary for filtering down distinct values from search
    distinctSetFieldValues$(event.payload.field as SetColField).pipe(
      map((distinctSetFieldValues) => ({
        event,
        distinctSetFieldValues,
      })),
    ),
  ),
  scan((appliedFilters, { event, distinctSetFieldValues }) => {
    let newValues: Set<unknown>
    const field = event.payload.field
    if (event.type === "reset") {
      newValues = new Set()
    } else if (event.type === "searchInput") {
      const { value: searchTerm } = event.payload
      if (searchTerm.length === 0) {
        newValues = new Set()
      } else {
        newValues = new Set(
          [...distinctSetFieldValues].filter((fieldValue) =>
            String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )
      }
    } else {
      newValues = new Set(
        appliedFilters[field as SetColField] as Iterable<string>,
      )
      const value = event.payload.value as any
      // Unsetting the field if it's already included
      // in applied filters.  Setting otherwise.
      if (newValues.has(value)) {
        newValues.delete(value)
      } else {
        newValues.add(value)
      }
    }
    return {
      ...appliedFilters,
      [field]: newValues,
    }
  }, createFilterValuesContainer()),
  startWith(createFilterValuesContainer()),
  shareReplay(), // persist across mounting/unmounting
)

/**
 * Construct set filter state stream as entries.
 *
 * Used by set filter predicate to filter trades.
 */
export const appliedSetFilterEntries$ = appliedSetFilters$.pipe(
  map((appliedFilters) =>
    Object.entries(appliedFilters).filter(
      ([_, valueSet]) => valueSet.size !== 0,
    ),
  ),
)

/**
 * State hook and parametric stream of applied filter-value options
 *  used by SetFilter component to render options.
 */
export const [
  useAppliedSetFieldFilters,
  appliedSetFieldFilters$,
] = bind((field: SetColField) =>
  appliedSetFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
)
