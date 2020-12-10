import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav, LeftNavTitle } from './styled'
import { TileView } from './types'
import {useSelectedCurrency,
        useCurrencies,
        onSelectCurrency } from 'services/currencyPairs'
interface Props {
  tileView: TileView
}

export const MainHeader: React.FC<Props> = ({tileView}) => {
  const currencies = useCurrencies()
  const defaultOption = 'ALL'
  const currency = useSelectedCurrency()
  const options = [defaultOption, ...currencies]
  
  return (
    <Header>
      <LeftNav>
        <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
        {options.map((currencyOption) => (
          <NavItem
            key={currencyOption}
            active={currencyOption === currency}
            data-qa="workspace-header__nav-item"
            data-qa-id={`currency-option-${currencyOption.toLowerCase()}`}
            onClick={() => onSelectCurrency(currencyOption)}
          >
            {currencyOption}
          </NavItem>
        ))}
      </LeftNav>

    </Header>
  )
}
