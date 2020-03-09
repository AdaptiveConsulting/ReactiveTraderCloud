import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { TileView } from './types'
import ToggleView from './ToggleView'

interface Props {
  currencyOptions: string[]
  tileView: TileView
  currency: string
  defaultOption: string
}

const WorkspaceHeader: React.FC<Props> = ({
  defaultOption,
  tileView,
  currency,
  currencyOptions,
}) => {
  const options = [defaultOption, ...currencyOptions]
  return (
    <Header>
      <LeftNav>
        <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
        {options.map(currencyOption => (
          <NavItem
            key={currencyOption}
            active={currencyOption === currency}
            data-qa="workspace-header__nav-item"
            data-qa-id={`currency-option-${currencyOption.toLowerCase()}`}
          >
            <NavLink to={`/${currencyOption}/${tileView}`}>{currencyOption}</NavLink>
          </NavItem>
        ))}
      </LeftNav>
      <RightNav>
        <ToggleView currency={currency} tileView={tileView} />
      </RightNav>
    </Header>
  )
}

export default WorkspaceHeader
