import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { startWith } from "rxjs/operators"

export enum RfqsTab {
  All = "All",
  Live = "Live",
  Expired = "Expired",
  Done = "Done",
  Cancelled = "Cancelled",
}

export const RFQS_TABS: RfqsTab[] = Object.values(RfqsTab)

const [internalSelectedRfqsTab$, setSelectedRfqsTab] = createSignal<RfqsTab>()

export { setSelectedRfqsTab }
export const [useSelectedRfqsTab, selectedRfqsTab$] = bind(
  internalSelectedRfqsTab$.pipe(startWith(RfqsTab.All)),
  RfqsTab.All,
)
