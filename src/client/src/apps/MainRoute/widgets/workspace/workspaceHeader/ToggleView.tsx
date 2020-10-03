import React from 'react'
import styled from 'styled-components/macro'
import { ChartIcon } from 'rt-components'
import { TileView } from './types'
import { NavItem } from './styled'

interface Props {
  tileView: TileView
  onTileViewChange: (tileView: TileView) => void
}

const ToggleItem = styled(NavItem)<{ active: boolean }>`
  list-style-type: none;
  margin-left: 15px;

  svg {
    color: ${({ theme }) => theme.secondary.base};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    height: 34px;
    line-height: 34px;
    opacity: ${({ active }) => (active ? '1' : '0.52')};
    background: ${({ active, theme }) => (active ? theme.core.lightBackground : 'none')};
    text-decoration: none;
    padding: 5px;
    min-width: 34px;
    min-height: 34px;
    text-align: center;
    border-radius: 2px;
  }
`

const ToggleView: React.FC<Props> = ({ tileView, onTileViewChange }) => {
  const handleToggleView = () => {
    const newView = TileView.Analytics === tileView ? TileView.Normal : TileView.Analytics
    onTileViewChange(newView)
  }

  return (
    <ToggleItem
      active={TileView.Analytics === tileView}
      data-qa="workspace-header__nav-item--view"
      data-qa-id={`workspace-view-${tileView.toLowerCase()}`}
      onClick={handleToggleView}
    >
      <ChartIcon />
    </ToggleItem>
  )
}

export default ToggleView
