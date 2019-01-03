import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { CurrencyOptions } from './types'
// const HeaderWrapper = styled.div`
//   // display: flex;
//   width: 100%;
//   height: 100%;
// `
interface WorkspaceHeaderProps {
  tradingTileView: string
  currencyOptionView: CurrencyOptions
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
    const { currencyOptionView, onCurrencyChange, tradingTileView, onTileViewChange } = this.props
    return (
      <Header>
        <LeftNav>
          <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
          {currencyOptions.map(currencyOption => (
            <NavItem
              key={currencyOption}
              active={currencyOption === currencyOptionView}
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
