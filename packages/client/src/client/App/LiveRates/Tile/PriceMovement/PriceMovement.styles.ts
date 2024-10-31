import { FaSortDown, FaSortUp } from "react-icons/fa"
import styled from "styled-components"

export const MovementIconUP = styled(FaSortUp)<{ $show: boolean }>`
  position: absolute;
  visibility: ${({ $show: show }) => (show ? "visible" : "hidden")};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-success-primary (600)"]};
  top: 50%;
  margin-top: -16px;
`
export const MovementIconDown = styled(FaSortDown)<{ $show: boolean }>`
  position: absolute;
  visibility: ${({ $show: show }) => (show ? "visible" : "hidden")};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-error-primary (600)"]};
  bottom: 50%;
  margin-bottom: -16px;
`

export const MovementValue = styled.div`
  font-size: 10px;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-tertiary (600)"]};
  padding: ${({ theme }) => theme.newTheme.spacing.lg} 0;
`

export const PriceMovementStyle = styled.div<{
  isAnalyticsView: boolean
}>`
  position: relative;
  display: flex;
  padding-right: ${({ isAnalyticsView }) => (isAnalyticsView ? "9px" : "0")};
  padding-left: ${({ isAnalyticsView }) => (isAnalyticsView ? "9px" : "0")};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  z-index: 1;
  grid-area: movement;
`
