import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

import { supportsTearOut } from "@/client/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/client/App/TearOutSection/TearOutComponent"
import { DropdownMenu } from "@/client/components/DropdownMenu"
import { currencyPairs$ } from "@/client/services/currencyPairs"
import { useIsLimitCheckerRunning } from "@/client/services/limitChecker/limitChecker"

import {
  ALL_CURRENCIES,
  onSelectCurrency,
  useSelectedCurrency,
} from "../selectedCurrency"
import {
  CurrencyDropdown,
  Header,
  LeftNav,
  LeftNavItemFirst,
  LeftNavTitle,
  NavItem,
  RightNav,
} from "../styled"
import { LimitCheckerIndicator } from "./LimitCheckerIndicator"
import { ToggleView } from "./ToggleView"

const [useCurrencies, mainHeader$] = bind(
  currencyPairs$.pipe(
    map((currencyPairs) => [
      ...new Set(
        Object.values(currencyPairs).map((currencyPair) => currencyPair.base),
      ),
    ]),
  ),
)

export { mainHeader$ }

export const MainHeader = () => {
  const currencies = useCurrencies()
  const currency = useSelectedCurrency()
  const isLimitCheckerRunning = useIsLimitCheckerRunning()

  const options = [ALL_CURRENCIES, ...currencies]

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
            {currencyOption}
          </NavItem>
        ))}
      </LeftNav>
      <LeftNavTitle>Live Rates</LeftNavTitle>
      <RightNav>
        <CurrencyDropdown>
          <DropdownMenu
            selectedOption={currency}
            options={options}
            onSelectionChange={onSelectCurrency}
          />
        </CurrencyDropdown>
        <ToggleView />
        {isLimitCheckerRunning && <LimitCheckerIndicator />}
        {supportsTearOut && <TearOutComponent section="tiles" />}
      </RightNav>
    </Header>
  )
}
