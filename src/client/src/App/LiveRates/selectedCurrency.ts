import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { startWith } from "rxjs/operators"

const ALL_CURRENCIES_ = Symbol("all")
export type AllCurrencies = typeof ALL_CURRENCIES_
export const ALL_CURRENCIES = ALL_CURRENCIES_ as AllCurrencies

const [selectedCurrencyInput$, onSelectCurrency] = createSignal<
  string | AllCurrencies
>()

export { onSelectCurrency }
export const [useSelectedCurrency, selectedCurrency$] = bind(
  selectedCurrencyInput$.pipe(startWith(ALL_CURRENCIES)),
  ALL_CURRENCIES,
)
