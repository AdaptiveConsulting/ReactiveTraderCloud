import { Direction } from "@/services/trades"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import styled from "styled-components"

const BuySellToggleWrapper = styled.div`
  display: flex;
`

const DirectionButton = styled.button<{
  direction: Direction
  active?: boolean
}>`
  flex: 1;
  border-radius: 2px;
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
  font-size: 11px;
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

const [rfqDirection$, setRfqDirection] = createSignal<Direction>()

const [useRfqDirection] = bind(rfqDirection$, Direction.Buy)

export const BuySellToggle: FC = () => {
  const direction = useRfqDirection()

  return (
    <BuySellToggleWrapper>
      <DirectionButton
        direction={Direction.Buy}
        active={direction === Direction.Buy}
        onClick={() => setRfqDirection(Direction.Buy)}
      >
        Buy
      </DirectionButton>
      <DirectionButton
        direction={Direction.Sell}
        active={direction === Direction.Sell}
        onClick={() => setRfqDirection(Direction.Sell)}
      >
        Sell
      </DirectionButton>
    </BuySellToggleWrapper>
  )
}
