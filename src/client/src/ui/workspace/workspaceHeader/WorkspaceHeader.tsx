import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { CurrencyOptions } from './types'

interface Props {
  onCurrencyChange: (currency: CurrencyOptions) => void
  onTileViewChange: (tileView: string) => void
}

interface State {
  activeTileView: string
  activeCurrencyOption: string
}
//TODO ML 03/01 move this somewhere else as constants?
const currencyOptions: CurrencyOptions[] = [
  CurrencyOptions.All,
  CurrencyOptions.EUR,
  CurrencyOptions.GBP,
  CurrencyOptions.USD,
]

const tileViews = ['Normal', 'Analytics']

class WorkspaceHeader extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { activeTileView: 'Normal', activeCurrencyOption: CurrencyOptions.All }
  }

  onTileViewChange = (tileView: string) => {
    this.setState({ activeTileView: tileView })
    this.props.onTileViewChange(tileView)
  }

  onCurrencyChange = (currency: CurrencyOptions) => {
    this.setState({ activeCurrencyOption: currency })
    this.props.onCurrencyChange(currency)
  }

  render() {
    const { activeTileView, activeCurrencyOption } = this.state
    return (
      <Header>
        <LeftNav>
          <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
          {currencyOptions.map(currencyOption => (
            <NavItem
              key={currencyOption}
              active={currencyOption === activeCurrencyOption}
              onClick={() => this.onCurrencyChange(currencyOption)}
            >
              {currencyOption}
            </NavItem>
          ))}
        </LeftNav>
        <RightNav>
          {tileViews.map(tileView => (
            <NavItem
              key={tileView}
              active={tileView === activeTileView}
              onClick={() => this.onTileViewChange(tileView)}
            >
              {tileView}
            </NavItem>
          ))}
        </RightNav>
      </Header>
    )
  }
}

export default WorkspaceHeader
