import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav } from './styled'
import { TileView } from './types'
import AnalyticsViewIcon from './AnalyticsTileViewIcon'
import SpotTileViewIcon from './SpotTileViewIcon'
interface Props {
  currencyOptions: string[]
  tileView: TileView
  currency: string
  defaultOption: string
}

const tileViews = {
  [TileView.Analytics]: AnalyticsViewIcon,
  [TileView.Normal]: SpotTileViewIcon,
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
        {Object.keys(tileViews).map(view => {
          const Icon = tileViews[view]
          return (
            <NavItem
              key={view}
              active={view === tileView}
              data-qa="workspace-header__nav-item--view"
              data-qa-id={`workspace-view-${view.toLowerCase()}`}
            >
              <NavLink to={`/${currency}/${view}`}>
                <Icon />
              </NavLink>
            </NavItem>
          )
        })}
      </RightNav>
    </Header>
  )
}

export default WorkspaceHeader
