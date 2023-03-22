import styled from "styled-components"

import { Direction } from "@/generated/TradingGateway"
import { ThemeName } from "@/theme"

interface WithDirection {
  direction: Direction
}

interface WithTerminated {
  terminated: boolean
}

export const DirectionContainer = styled.div<WithDirection & WithTerminated>`
  display: flex;
  flex: 0 0 48px;
  background-color: ${({ theme, direction, terminated }) =>
    terminated
      ? theme.primary[2]
      : direction === Direction.Buy
      ? "rgba(76, 118, 196, 0.15)"
      : "rgba(167, 39, 64, 0.15)"};
`

// Not sure about the clipped path value here, atm they are eyeballed
export const DirectionLabel = styled.div<WithDirection & WithTerminated>`
  position: relative;
  display: flex;
  justify-content: ${({ direction }) =>
    direction === Direction.Buy ? "flex-start" : "flex-end"};
  align-items: center;
  padding: ${({ direction }) =>
    direction === Direction.Buy ? "0 0 0 4px" : "0 4px 0 0"};
  width: 72px;
  white-space: pre-wrap;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme, terminated }) =>
    terminated ? theme.secondary[5] : theme.white};
  border-radius: 2px;
  background-color: ${({ theme, direction, terminated }) =>
    terminated
      ? theme.primary[theme.name === ThemeName.Dark ? 1 : 3]
      : theme.colors.spectrum.uniqueCollections[direction].darker};
  clip-path: ${({ direction }) =>
    direction === Direction.Buy
      ? "polygon(0 0, 100% 0, 70% 100%, 0% 100%)"
      : "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)"};
  &:after {
    right: ${({ direction }) => (direction === Direction.Buy ? 0 : null)};
    left: ${({ direction }) => (direction === Direction.Sell ? 0 : null)};
    width: 14px;
    z-index: 10;
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    background-color: ${({ theme, direction, terminated }) =>
      terminated
        ? theme.primary[theme.name === ThemeName.Dark ? 1 : 3]
        : theme.colors.spectrum.uniqueCollections[direction].base};
    -moz-transform: skewX(-24deg);
    -webkit-transform: skewX(-24deg);
    -ms-transform: skewX(-24deg);
    transform: skewX(-24deg);
  }

  div {
    width: 50px;
    text-align: center;
  }
`

export const InstrumentLabelContainer = styled.div<
  WithDirection & WithTerminated
>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  margin-left: ${({ direction }) =>
    direction === Direction.Sell ? "8px" : "4px"};
  color: ${({ theme, terminated }) =>
    terminated ? theme.secondary[5] : theme.textColor};
`

export const InstrumentName = styled.div`
  font-size: 13px;
  font-weight: 600;
`
