import {
  Header,
  LeftNav,
  LeftNavItemFirst,
  NavItem,
  RightNav,
  LeftNavTitle,
  CurrencyDropdown,
} from "../styled"
import {
  useSelectedCurrency,
  ALL_CURRENCIES,
  onSelectCurrency,
} from "../selectedCurrency"
import { ToggleView } from "./ToggleView"
import { currencyPairs$ } from "@/services/currencyPairs"
import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { supportsTearOut } from "@/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/App/TearOutSection/TearOutComponent"
import { useIsLimitCheckerRunning } from "@/services/limitChecker/limitChecker"
import { LimitCheckerIndicator } from "./LimitCheckerIndicator"
import { DropdownMenu } from "@/components/DropdownMenu"

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
