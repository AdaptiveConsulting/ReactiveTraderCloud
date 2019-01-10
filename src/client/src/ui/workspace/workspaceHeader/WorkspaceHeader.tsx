import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { CurrencyOptions, TileViews } from './types'

interface Props {
  onCurrencyChange: (currency: CurrencyOptions) => void
  onTileViewChange: (tileView: TileViews) => void
}

interface State {
  activeTileView: TileViews
  activeCurrencyOption: CurrencyOptions
}

const currencyOptions: CurrencyOptions[] = [
  CurrencyOptions.All,
  CurrencyOptions.EUR,
  CurrencyOptions.GBP,
  CurrencyOptions.USD,
]

const tileViews: TileViews[] = [TileViews.Normal, TileViews.Analytics]

class WorkspaceHeader extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { activeTileView: TileViews.Normal, activeCurrencyOption: CurrencyOptions.All }
  }

  onTileViewChange = (tileView: TileViews) => {
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
