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
  const goToView = TileView.Analytics === tileView ? TileView.Normal : TileView.Analytics
  const currentView = TileView.Analytics === tileView ? TileView.Normal : TileView.Analytics

  return (
    <NavItem
      active={TileView.Analytics === tileView}
      data-qa="workspace-header__nav-item--view"
      data-qa-id={`workspace-view-${currentView.toLowerCase()}`}
    >
      <NavLink to={`/${currency}/${goToView}`}>{ChartIcon}</NavLink>
    </NavItem>
  )
}

export default ToggleView
