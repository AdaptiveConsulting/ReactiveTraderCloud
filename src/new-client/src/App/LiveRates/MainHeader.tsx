import React from "react"
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from "./styled"
import { useSelectedTileView, onSelectTileView } from "services/tiles"
import {
  useSelectedCurrency,
  useCurrencies,
  onSelectCurrency,
  ALL_CURRENCIES,
} from "services/currencyPairs"
import { ToggleView } from "./Tiles/ToggleView/ToggleView"

export const MainHeader: React.FC = () => {
  const currencies = useCurrencies()
  const defaultOption: typeof ALL_CURRENCIES = ALL_CURRENCIES
  const currency = useSelectedCurrency()
  const options: (string | typeof ALL_CURRENCIES)[] = [
    defaultOption,
    ...currencies,
  ]
  const tileView = useSelectedTileView()

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
      <RightNav>
        <ToggleView tileView={tileView} onTileViewChange={onSelectTileView} />
      </RightNav>
    </Header>
  )
}
