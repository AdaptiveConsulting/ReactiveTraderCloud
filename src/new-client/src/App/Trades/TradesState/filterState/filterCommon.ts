import { createListener } from "@react-rxjs/utils"
import type { ColField } from "../colConfig"

export enum ComparatorType {
  Equals = "Equals",
  NotEqual = "Not equal",
  Less = "Less than",
  LessOrEqual = "Less than or equals",
  Greater = "Greater than",
  GreaterOrEqual = "Greater than or equals",
  InRange = "In range",
}
export interface FilterEvent {
  field: ColField
}

export const [filterResets$, onFilterReset] = createListener(
  (field: ColField) => ({ field } as FilterEvent),
)

export const [quickFilterInputs$, onQuickFilterInput] = createListener<string>()

export const initialFilterContent = {
  comparator: ComparatorType.Equals,
  value1: null,
  value2: null,
}
