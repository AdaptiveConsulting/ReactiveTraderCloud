import {
  Header,
  LeftNav,
  LeftNavItemFirst,
  NavItem,
  RightNav,
  LeftNavTitle,
} from "../styled"
import {
  useSelectedCurrency,
  AllCurrencies,
  ALL_CURRENCIES,
  onSelectCurrency,
} from "../selectedCurrency"
import { ToggleView } from "./ToggleView"
import { CurrencyOptions } from "./CurrencyOptions"
import { currencyPairs$ } from "@/services/currencyPairs"
import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOutSection } from "@/Web/TearOutSection/state"

import { supportsTearOut } from "@/Web/TearOutSection/supportsTearOut"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { HeaderAction } from "@/components/styled"

import {
  useTearOutSectionEntry,
  useTearOutSectionState$,
} from "@/Web/TearOutSection/state"
import { useEffect } from "react"
const [useCurrencies, mainHeader$] = bind(
  currencyPairs$.pipe(
    map((currencyPairs) => [
      ...new Set(
        Object.values(currencyPairs).map((currencyPair) => currencyPair.base),
      ),
    ]),
  ),
)

var isTornOut = false
export { mainHeader$ }
export const MainHeader: React.FC = () => {
  const currencies = useCurrencies()
  const currency = useSelectedCurrency()

  const options = [ALL_CURRENCIES as AllCurrencies, ...currencies]
  const tearOutTileState = useTearOutSectionState$("liverates")

  useEffect(() => {
    console.log("component", tearOutTileState)
  }, [tearOutTileState])

  return (
    <Header>
      <LeftNav>
        <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
        {options.map((currencyOption) => (
          <NavItem
            data-testid={`menuButton-${currencyOption.toString()}`}
            key={currencyOption.toString()}
            active={currencyOption === currency}
            data-qa="workspace-header__nav-item"
            data-qa-id={`currency-option-${currencyOption
              .toString()
              .toLowerCase()}`}
            onClick={() => onSelectCurrency(currencyOption)}
          >
            {currencyOption === ALL_CURRENCIES ? "ALL" : currencyOption}
          </NavItem>
        ))}
      </LeftNav>
      <LeftNavTitle>Live Rates</LeftNavTitle>
      <RightNav>
        <CurrencyOptions
          options={options}
          onSelectionChange={onSelectCurrency}
        />
        <ToggleView />
        {supportsTearOut && !isTornOut && (
          <HeaderAction onClick={() => tearOutSection(true, "liverates")}>
            {/*en comptes de true !isTOrnOut2 */}
            {isTornOut ? <PopInIcon /> : <PopOutIcon />}
          </HeaderAction>
        )}
      </RightNav>
    </Header>
  )
}
