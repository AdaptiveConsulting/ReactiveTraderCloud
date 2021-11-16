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
import { supportsTearOut } from "@/App/supportsTearOut"
import { TearOutComponent } from "@/Web/TearOutSection/TearOutComponent"

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
export const MainHeader: React.FC = () => {
  const currencies = useCurrencies()
  const currency = useSelectedCurrency()

  const options = [ALL_CURRENCIES as AllCurrencies, ...currencies]

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
        {supportsTearOut && <TearOutComponent section="liverates" />}
      </RightNav>
    </Header>
  )
}
