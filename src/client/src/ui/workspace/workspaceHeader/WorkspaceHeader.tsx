import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { CurrencyOptions } from './types'

interface WorkspaceHeaderProps {
  tradingTileView: string
  currencyView: CurrencyOptions
  onCurrencyChange: (currency: CurrencyOptions) => void
  onTileViewChange: (tileView: string) => void
}

//TODO ML 03/01 move this somewhere else as constants?
const currencyOptions: CurrencyOptions[] = [
  CurrencyOptions.All,
  CurrencyOptions.EUR,
  CurrencyOptions.GBP,
  CurrencyOptions.USD,
]

const tileViews = ['Normal', 'Analytics']

class WorkspaceHeader extends React.Component<WorkspaceHeaderProps> {
  render() {
    const { currencyView, onCurrencyChange, tradingTileView, onTileViewChange } = this.props
    return (
      <Header>
        <LeftNav>
          <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
          {currencyOptions.map(currencyOption => (
            <NavItem
              key={currencyOption}
              active={currencyOption === currencyView}
              onClick={() => onCurrencyChange(currencyOption)}
            >
              {currencyOption}
            </NavItem>
          ))}
        </LeftNav>
        <RightNav>
          {tileViews.map(tileView => (
            <NavItem key={tileView} active={tileView === tradingTileView} onClick={() => onTileViewChange(tileView)}>
              {tileView}
            </NavItem>
          ))}
        </RightNav>
      </Header>
    )
  }
}

export default WorkspaceHeader
