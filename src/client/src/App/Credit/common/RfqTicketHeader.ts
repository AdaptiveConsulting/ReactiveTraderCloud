import { Direction } from "@/generated/TradingGateway"
import styled from "styled-components"

interface WithDirection {
  direction: Direction
}

export const DirectionContainer = styled.div<WithDirection>`
  display: flex;
  width: 100%;
  flex: 0 0 48px;
  align-items: center;
  background-color: ${(props) =>
    props.direction === Direction.Buy
      ? "rgba(76, 118, 196, 0.15)"
      : "rgba(167, 39, 64, 0.15)"};
`

// Not sure about the clipped path value here, atm they are eyeballed
export const DirectionLabel = styled.div<WithDirection>`
  position: relative;
  display: flex;
  justify-content: ${({ direction }) =>
    direction === Direction.Buy ? "start" : "end"};
  align-items: center;
  padding: ${({ direction }) =>
    direction === Direction.Buy ? "0 0 0 4px" : "0 4px 0 0"};
  height: 100%;
  width: 70px;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.white};
  border-radius: 2px;
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].darker};
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
    background-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].base};
    -moz-transform: skewX(-24deg);
    -webkit-transform: skewX(-24deg);
    -ms-transform: skewX(-24deg);
    transform: skewX(-24deg);
  }
`

export const InstrumentLabelContainer = styled.div<WithDirection>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  margin-left: ${({ direction }) =>
    direction === Direction.Sell ? "8px" : "4px"};
`

export const InstrumentName = styled.div`
  font-size: 13px;
  font-weight: 600;
`
