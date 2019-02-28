import React, { FC } from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { CurrencyOptions, TileViews } from './types'
import AnalyticsViewIcon from './AnalyticsTileViewIcon'
import SpotTileViewIcon from './SpotTileViewIcon'
interface Props {
  tileView: TileViews
  currencyView: CurrencyOptions
  onCurrencyChange: (currency: CurrencyOptions) => void
  onTileViewChange: (tileView: TileViews) => void
}

const currencyOptions: CurrencyOptions[] = [
  CurrencyOptions.All,
  CurrencyOptions.EUR,
  CurrencyOptions.GBP,
  CurrencyOptions.USD,
]

const tileViews = {
  [TileViews.Normal]: SpotTileViewIcon,
  [TileViews.Analytics]: AnalyticsViewIcon,
}

const WorkspaceHeader: FC<Props> = ({ tileView, currencyView, onCurrencyChange, onTileViewChange }) => {
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
        {Object.keys(tileViews).map(view => {
          const Icon = tileViews[view]
          return (
            <NavItem key={view} active={view === tileView} onClick={() => onTileViewChange(view as TileViews)}>
              <Icon />
            </NavItem>
          )
        })}
      </RightNav>
    </Header>
  )
}

export default WorkspaceHeader
