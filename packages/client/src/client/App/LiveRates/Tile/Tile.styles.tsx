import styled from "styled-components"

import { DeliveryDate, HeaderAction } from "./Header"
import { useTileContext } from "./Tile.context"

export const PriceControlsStyle = styled("div")(({ theme }) => {
  const { showingChart } = useTileContext()
  return `
  display: grid;
  flex: 1;
  height: 100%;
  ${
    showingChart
      ? `
  grid-template-rows: 50% 50%;
  grid-template-areas:
  "movement sell"
  "movement buy";
  gap: ${theme.spacing.xxs};
  padding-right: ${theme.spacing.xs}
  `
      : `
  grid-template-columns: 1fr .35fr 1fr;
  grid-template-rows: 100%;
  grid-template-areas:
  "sell movement buy";
  padding: 0 ${theme.spacing.md};
`
  }
`
})

export const InputTimerStyle = styled.div(() => {
  const { showingChart } = useTileContext()
  return `
  display: flex;
  flex-direction: column;
  ${
    !showingChart &&
    `align-items: flex-start;
`
  }
`
})

export const PanelItem = styled.div<{ shouldMoveDate: boolean }>`
  position: relative;
  display: flex;
  &:hover,
  &.tile-hover {
    ${HeaderAction} {
      opacity: 1;
    }

    ${DeliveryDate} {
      margin-right: ${({ shouldMoveDate, theme }) =>
        shouldMoveDate ? theme.spacing["2xl"] : "0"};
    }
  }
`
export const Body = styled.div(({ theme }) => {
  const { showingChart } = useTileContext()
  return `
  display: flex;
  flex: 1;
  flex-direction: ${showingChart ? "row" : "column"};
  align-items: ${showingChart ? "center" : null};
  padding: ${theme.spacing.xs} 0;
  min-height: ${showingChart ? "136px" : "0"};
`
})

export const Main = styled.div`
  min-height: 142px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  box-shadow: 0 2px 20px
    ${({ theme }) => theme.color["Colors/Background/bg-secondary"]};
  &:hover,
  .tile-hover & {
    color: ${({ theme }) =>
      theme.color["Colors/Text/text-brand-primary (900)"]};
  }
`
