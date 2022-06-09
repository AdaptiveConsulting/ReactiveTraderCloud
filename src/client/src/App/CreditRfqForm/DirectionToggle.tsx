import { Direction } from "@/services/trades"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import styled from "styled-components"

const DirectionToggleWrapper = styled.div`
  display: flex;
`

interface DirectionButtonProps {
  direction: Direction
  active?: boolean
}

const DirectionButton = styled.button<DirectionButtonProps>`
  flex: 1;
  border-radius: 3px;
  background-color: ${({ theme, direction, active }) =>
    active
      ? theme.colors.spectrum.uniqueCollections[direction].base
      : theme.primary[2]};
  border: 1px solid
    ${({ theme, direction, active }) =>
      active
        ? theme.colors.spectrum.uniqueCollections[direction].base
        : theme.primary[3]};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.7rem;
  height: 24px;
  font-size: 12px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].base};
    border-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].base};
  }

  &:first-child {
    margin-right: 3px;
  }
`

const [direction$, setDirection] = createSignal<Direction>()

const [useDirection] = bind(direction$, Direction.Buy)

export { setDirection, useDirection }

export const DirectionToggle: FC = () => {
  const direction = useDirection()

  return (
    <DirectionToggleWrapper>
      <DirectionButton
        direction={Direction.Buy}
        active={direction === Direction.Buy}
        onClick={() => setDirection(Direction.Buy)}
      >
        Buy
      </DirectionButton>
      <DirectionButton
        direction={Direction.Sell}
        active={direction === Direction.Sell}
        onClick={() => setDirection(Direction.Sell)}
      >
        Sell
      </DirectionButton>
    </DirectionToggleWrapper>
  )
}
