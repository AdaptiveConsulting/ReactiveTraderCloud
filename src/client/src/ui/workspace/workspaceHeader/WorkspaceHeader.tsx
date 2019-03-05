import React, { FC } from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { TileViews } from './types'
import AnalyticsViewIcon from './AnalyticsTileViewIcon'
import SpotTileViewIcon from './SpotTileViewIcon'
interface Props {
  currencyOptions: string[]
  tileView: TileViews
  currency: string
  defaultOption: string
  onCurrencyChange: (currency: string) => void
  onTileViewChange: (tileView: TileViews) => void
}

const tileViews = {
  [TileViews.Normal]: SpotTileViewIcon,
  [TileViews.Analytics]: AnalyticsViewIcon,
}

const WorkspaceHeader: FC<Props> = ({
  defaultOption,
  tileView,
  currency,
  onCurrencyChange,
  onTileViewChange,
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
