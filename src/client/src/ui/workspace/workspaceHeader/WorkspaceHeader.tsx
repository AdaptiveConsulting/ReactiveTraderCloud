import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { CurrencyOptions, TileViews } from './types'
import AnalyticsViewIcon from './AnalyticsViewIcon'

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

const tileViews = {
  [TileViews.Normal]: AnalyticsViewIcon,
  [TileViews.Analytics]: AnalyticsViewIcon,
}

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
    const keys = Object.keys(tileViews) as TileViews[]
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
          {keys.map(tileView => {
            const Icon = tileViews[tileView]
            return (
              <NavItem
                key={tileView}
                active={tileView === activeTileView}
                onClick={() => this.onTileViewChange(tileView)}
              >
                <Icon />
              </NavItem>
            )
          })}
        </RightNav>
      </Header>
    )
  }
}

export default WorkspaceHeader
