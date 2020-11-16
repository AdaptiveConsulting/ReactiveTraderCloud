import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav, LeftNavTitle } from './styled'
import { TileView } from './types'
import ToggleView from './ToggleView'
import WorkspaceControl from './WorkspaceControl'
import CurrencyOptions from './CurrencyOptions'

interface Props {
  currencyOptions: string[]
  tileView: TileView
  currency: string
  defaultOption: string
  canPopout: boolean
  onPopoutClick?: (x: number, y: number) => void
  onCurrencyChange: (currency: string) => void
  onTileViewChange: (tileView: TileView) => void
}

const WorkspaceHeader: React.FC<Props> = ({
  defaultOption,
  tileView,
  currency,
  currencyOptions,
  canPopout,
  onPopoutClick,
  onCurrencyChange,
  onTileViewChange,
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
            onClick={() => onCurrencyChange(currencyOption)}
          >
            {currencyOption}
          </NavItem>
        ))}
      </LeftNav>

      <LeftNavTitle>Live Rates</LeftNavTitle>

      <RightNav>
        <CurrencyOptions options={options} onSelectionChange={onCurrencyChange} />
        <ToggleView tileView={tileView} onTileViewChange={onTileViewChange} />
        {canPopout && (
          <WorkspaceControl onPopoutClick={onPopoutClick} data-qa="tiles-header__pop-out-button" />
        )}
      </RightNav>
    </Header>
  )
}

export default WorkspaceHeader
