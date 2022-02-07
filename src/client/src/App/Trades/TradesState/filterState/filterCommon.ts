import { createSignal } from "@react-rxjs/utils"
import type { ColField } from "../colConfig"

/**
 * Used by date and number filter UI to populate
 * options and by trade filtering logic to define
 * predicate tests.
 */
export enum ComparatorType {
  Equals = "Equals",
  NotEqual = "Not equal",
  Less = "Less than",
  LessOrEqual = "Less than or equals",
  Greater = "Greater than",
  GreaterOrEqual = "Greater than or equals",
  InRange = "In range",
}

/**
 * All filter events extend this.  At a minimum,
 * a filter event specifies a column field whose
 * filters must be set or unset.
 */
export interface FilterEvent {
  field: ColField
}

/**
 * Unsets column field.  Represents a "Select All" on
 * the column or a selection from the TradesHeader.
 */
export const [filterResets$, onFilterReset] = createSignal(
  (field: ColField) => ({ field } as FilterEvent),
)

/**
 * Text stream for filtering grid across any column that matches
 * search terms, delimited by white space.
 */
export const [quickFilterInputs$, onQuickFilterInput] = createSignal<string>()

/**
 * Used by date and number filters
 */
export const initialFilterContent = {
  comparator: ComparatorType.Equals,
  value1: null,
  value2: null,
}
