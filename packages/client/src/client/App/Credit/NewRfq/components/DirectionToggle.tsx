import styled from "styled-components"

import { DirectionIcon } from "@/client/components/icons/DirectionIcon"
import { Direction } from "@/generated/TradingGateway"

const DirectionToggleWrapper = styled.div`
  display: flex;
  position: relative;
`

interface DirectionButtonProps {
  direction: Direction
  active?: boolean
}

const DirectionButton = styled.button<DirectionButtonProps>`
  flex: 1;
  background-color: ${({ theme, direction, active }) =>
    active
      ? theme.colors.spectrum.uniqueCollections[direction].darker
      : theme.primary[2]};
  border: 1px solid
    ${({ theme, direction, active }) =>
      active
        ? theme.colors.spectrum.uniqueCollections[direction].base
        : theme.primary[3]};
  color: ${({ theme, active }) =>
    active ? theme.white : theme.core.textColor};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.7rem;
  height: 48px;
  font-size: 12px;
  font-weight: 500;
  clip-path: ${({ direction }) =>
    direction === Direction.Buy
      ? "polygon(0 0, 100% 0, 90% 100%, 0% 100%)"
      : "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)"};

  &:after {
    z-index: -1;
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    background-color: transparent;
    transform: skewX(-21deg);
  }

  &:first-child {
    margin-right: -6.5px;
  }

  &:last-child {
    margin-left: -6.5px;
  }

  &:first-child:after {
    left: 0;
    width: calc(50% - 3px);
    border-right: 1px solid
      ${({ theme, direction, active }) =>
        active
          ? theme.colors.spectrum.uniqueCollections[direction].base
          : theme.primary[3]};
  }

  &:last-child:after {
    right: 0;
    width: calc(50% - 3px);
    border-left: 1px solid
      ${({ theme, direction, active }) =>
        active
          ? theme.colors.spectrum.uniqueCollections[direction].base
          : theme.primary[3]};
  }

  &:hover {
    background-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].darker};
    border-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].base};
    color: ${({ theme }) => theme.white};
  }

  &:hover:after {
    border-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].base};
  }
`

const IconWrapper = styled.div<{ direction: Direction }>`
  position: absolute;
  top: 12px;
  left: calc(50% - 13px);
  z-index: 1;
  color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].base};
`

export const DirectionToggle = ({
  onChange,
  direction,
}: {
  onChange: (direction: Direction) => void
  direction: Direction
}) => {
  return (
    <DirectionToggleWrapper>
      <DirectionButton
        direction={Direction.Buy}
        active={direction === Direction.Buy}
        onClick={() => onChange(Direction.Buy)}
      >
        YOU BUY
      </DirectionButton>
      <IconWrapper direction={direction}>
        <DirectionIcon />
      </IconWrapper>
      <DirectionButton
        direction={Direction.Sell}
        active={direction === Direction.Sell}
        onClick={() => onChange(Direction.Sell)}
      >
        YOU SELL
      </DirectionButton>
    </DirectionToggleWrapper>
  )
}
