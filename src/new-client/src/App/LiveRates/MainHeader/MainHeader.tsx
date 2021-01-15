import { useCurrencies, currencies$ } from "services/currencyPairs"
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
      </RightNav>
    </Header>
  )
}

export const mainHeader$ = currencies$
