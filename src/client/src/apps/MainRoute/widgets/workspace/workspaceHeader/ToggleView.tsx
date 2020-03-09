import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem } from './styled'
import { TileView } from './types'
import { ChartIcon } from 'rt-components'

interface Props {
  tileView: TileView
  currency: string
}

const ToggleView: React.FC<Props> = ({ tileView, currency }) => {
  const isAnalyticsViewActive = TileView.Analytics === tileView
  const goToView = isAnalyticsViewActive ? TileView.Normal : TileView.Analytics

  return (
    <NavItem
      active={isAnalyticsViewActive}
      data-qa="workspace-header__nav-item--view"
      data-qa-id={`workspace-view-${tileView.toLowerCase()}`}
    >
      <NavLink to={`/${currency}/${goToView}`}>
        <ChartIcon active={isAnalyticsViewActive} />
      </NavLink>
    </NavItem>
  )
}

export default ToggleView
