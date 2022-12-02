import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createSignal, mergeWithKey } from "@react-rxjs/utils"
import {
  ComparatorType,
  filterResets$,
  initialFilterContent,
} from "./filterCommon"
import { ColDef } from "../colConfig"
import { CreditTrade, FxTrade } from "@/services/trades"

/**
 * Subset of column fields (as type) that take number filters
 */
export type NumColField =
  | keyof Pick<FxTrade, "tradeId" | "notional" | "spotRate">
  | keyof Pick<CreditTrade, "tradeId" | "quantity" | "unitPrice">

/**
 * Subset of column fields (as values) that take number filters
 */
const extractNumberFields = (colDef: ColDef) =>
  Object.keys(colDef).filter((key) => colDef[key].filterType === "number")

/**
 * Three components of number filter state
 *
 * comparator
 * - the selected filter operation
 * - is always set
 *
 * value1
 * - the number entered into the primary
 * text input
 * - when no number is set, no filter is applied
 *
 * value2
 * - the number entered into the secondary
 * text input
 * - only relevant when comparator is set to a range
 */
export interface NumFilterContent {
  comparator: ComparatorType
  value1: number | null
  value2?: number | null
}

export type NumFilters = {
  [key in NumColField]: NumFilterContent
}
interface NumFilterSet {
  field: NumColField
  value: NumFilterContent
}

const getNumFilterDefaults = (colDef: ColDef) => {
  const numberFields = extractNumberFields(colDef)
  return numberFields.reduce((valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: initialFilterContent,
    }
  }, {} as Record<typeof numberFields[number], NumFilterContent>)
}

/**
 * Stream of number filter events (either selection of new comparator
 * or input of numerical value)
 *
 * ToDo - refactor into keyed signal
 */
const [colFilterNum$, onColFilterEnterNum] = createSignal(
  (field: NumColField, value: NumFilterContent) =>
    ({ field, value } as NumFilterSet),
)

export { onColFilterEnterNum }

/**
 * Stream that represents all currently set number
 * filters, keyed by column field.  Updates either
 * on column filter event or when the filter is
 * unset through the TradesHeader.
 */
export const getNumberFilters = (colDef: ColDef) =>
  mergeWithKey({
    set: colFilterNum$,
    reset: filterResets$,
  }).pipe(
    scan((appliedNumFilters, event) => {
      let newValues: NumFilterContent
      const field = event.payload.field
      if (event.type === "reset") {
        newValues = initialFilterContent
      } else {
        const value = event.payload.value as NumFilterContent
        newValues = value
      }
      return {
        ...appliedNumFilters,
        [field]: newValues,
      }
    }, getNumFilterDefaults(colDef)),
    startWith(getNumFilterDefaults(colDef)),
    shareReplay(), // persist across mounting/unmounting
  )

/**
 * State hook and parametric stream that emit number
 * filter state.  Used by NumFilter component.
 */
export const [useAppliedNumFilters, appliedNumFilters$] = bind(
  (field: NumColField, colDef: ColDef) =>
    getNumberFilters(colDef).pipe(
      map((appliedFilters) => appliedFilters[field]),
    ),
)

/**
 * Construct number filter state stream as entries.
 *
 * Used by number filter predicate to filter trades.
 */
export const getNumFilterEntries = (colDef: ColDef) =>
  getNumberFilters(colDef).pipe(
    map((numberFilters) =>
      Object.entries(numberFilters).filter(
        ([, valueSet]) => valueSet.value1 !== null,
      ),
    ),
  )
