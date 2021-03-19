import { map, mergeMap, scan, shareReplay, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createListener, mergeWithKey } from "@react-rxjs/utils"
import { mapObject } from "@/utils"
import type { Trade } from "@/services/trades"
import { trades$ } from "@/services/trades"
import { colConfigs, colFields } from "../colConfig"
import type { FilterEvent } from "./filterCommon"
import { filterResets$ } from "./filterCommon"

export type SetColField = keyof Pick<
  Trade,
  "status" | "direction" | "symbol" | "dealtCurrency" | "traderName"
>

export type DistinctValues = {
  [K in SetColField]: Set<Trade[K]>
}
interface ColFieldToggle<T extends SetColField> extends FilterEvent {
  value: Trade[T]
}

interface SearchInput extends FilterEvent {
  value: string
}

const [colFilterToggle$, onColFilterToggle] = createListener(
  <T extends SetColField>(field: T, value: Trade[T]) =>
    ({ field, value } as ColFieldToggle<T>),
)

const [_si$, onSearchInput] = createListener(
  <T extends SetColField>(field: T, value: string) =>
    ({ field, value } as SearchInput),
)

const searchInputs$ = _si$.pipe(shareReplay())

export { onColFilterToggle, onSearchInput, searchInputs$ }

const setFields = colFields.filter(
  (field) => colConfigs[field].filterType === "set",
) as SetColField[]

export const setFieldValuesContainer = Object.freeze(
  setFields.reduce((valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: new Set<Trade[typeof field]>(),
    }
  }, {} as DistinctValues),
)

const ClonedFieldValuesContainer = () =>
  mapObject(
    setFieldValuesContainer,
    (_, field) => new Set<Trade[typeof field]>(),
  )

const distinctValues$ = trades$.pipe(
  map((trades) =>
    trades.reduce((distinctValues, trade) => {
      return mapObject(distinctValues, (fieldValues, fieldName) => {
        return new Set<Trade[typeof fieldName]>([
          trade[fieldName],
          ...fieldValues,
        ])
      })
    }, ClonedFieldValuesContainer()),
  ),
)

export const [useDistinctSetFieldValues, distinctSetFieldValues$] = bind(
  <T extends SetColField>(field: T) =>
    distinctValues$.pipe(map((distinctValues) => distinctValues[field])),
  new Set(),
)

const appliedSetFilters$ = mergeWithKey({
  searchInput: searchInputs$,
  toggle: colFilterToggle$,
  reset: filterResets$,
}).pipe(
  mergeMap((event) =>
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
  }, ClonedFieldValuesContainer()),
  startWith(ClonedFieldValuesContainer()),
  shareReplay(),
)

export const [useAppliedSetFilterEntries, appliedSetFilterEntries$] = bind(
  appliedSetFilters$.pipe(
    map((appliedFilters) =>
      Object.entries(appliedFilters).filter(
        ([_, valueSet]) => valueSet.size !== 0,
      ),
    ),
  ),
  [],
)

export const [
  useAppliedSetFieldFilters,
  appliedSetFieldFilters$,
] = bind((field: SetColField) =>
  appliedSetFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
)
