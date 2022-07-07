import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { startWith } from "rxjs/operators"

export const ALL_RFQ_STATES = "All"

const [selectedRfqStateInput$, onSelectRfqState] = createSignal<string>()

export { onSelectRfqState }
export const [useSelectedRfqState, selectedRfqState$] = bind(
  selectedRfqStateInput$.pipe(startWith(ALL_RFQ_STATES)),
  ALL_RFQ_STATES,
)
