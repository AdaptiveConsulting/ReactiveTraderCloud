import styled from "styled-components"

import {
  getInitView,
  onToggleSelectedView,
  TileView,
  useSelectedTileView,
} from "../../selectedView"
import { IconNavItem } from "../../styled"
import { ChartIcon } from "./ChartIcon"

const ToggleItem = styled(IconNavItem)<{ active: boolean }>`
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-quaternary (500)"]};
  }
`

export const ToggleView = () => {
  const tileView = useSelectedTileView(getInitView())
  return (
    <ToggleItem
      data-testid="toggleButton"
      active={TileView.Analytics === tileView}
      data-qa="workspace-header__nav-item--view"
      data-qa-id={`workspace-view-${tileView}`}
      onClick={onToggleSelectedView}
    >
      <ChartIcon />
    </ToggleItem>
  )
}
