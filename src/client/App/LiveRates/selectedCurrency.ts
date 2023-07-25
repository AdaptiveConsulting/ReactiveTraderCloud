import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { startWith } from "rxjs/operators"

export const ALL_CURRENCIES = "ALL"

const [selectedCurrencyInput$, onSelectCurrency] = createSignal<string>()

export { onSelectCurrency }
export const [useSelectedCurrency, selectedCurrency$] = bind(
  selectedCurrencyInput$.pipe(startWith(ALL_CURRENCIES)),
  ALL_CURRENCIES,
)
