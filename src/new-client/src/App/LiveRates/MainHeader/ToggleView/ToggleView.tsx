import styled from "styled-components"
import {
  TileView,
  onToggleSelectedView,
  useSelectedTileView,
  getInitView,
} from "../../selectedView"
import { NavItem } from "../../styled"
import { ChartIcon } from "./ChartIcon"

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
    opacity: ${({ active }) => (active ? "1" : "0.52")};
    background: ${({ active, theme }) =>
      active ? theme.core.lightBackground : "none"};
    text-decoration: none;
    padding: 5px;
    min-width: 34px;
    min-height: 34px;
    text-align: center;
    border-radius: 2px;
  }
`

export const ToggleView: React.FC = () => {
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
