import styled from "styled-components/macro"

export const DeliveryDate = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
  margin-left: auto;
  transition: margin-right 0.2s;
`
export const TopRightButton = styled("button")`
  position: absolute;
  right: 1rem;
  top: 0.995rem;
  opacity: 0;
  transition: opacity 0.2s;
  &:hover {
    .hover-state {
      fill: #5f94f5;
    }
  }
`

export const ActionButton = styled("button")`
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid white;
`

export const ResetInputValue = styled.button`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  margin-left: 8px;
  grid-area: ResetInputValue;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

const RouteStyle = styled("div")`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  /* When in Finsemble a 25px header is injected,
   this resets body to the correct height */
  height: 100%;
`

export const TileBaseStyle = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;
  ${RouteStyle} & {
    border-radius: 0px;
  }
`

export const TileWrapperBase = styled.div<{ shouldMoveDate?: boolean }>`
  position: relative;
  &:hover ${TopRightButton} {
    opacity: 0.75;
  }
  &:hover ${DeliveryDate} {
    margin-right: ${({ shouldMoveDate }) => (shouldMoveDate ? "1.3rem" : "0")};
  }
  &:hover ${ActionButton} {
    opacity: 0.75;
  }
  color: ${({ theme }) => theme.core.textColor};
`
