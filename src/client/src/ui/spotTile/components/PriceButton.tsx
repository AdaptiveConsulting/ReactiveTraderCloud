import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-theme'
import { Direction } from 'rt-types'

const hoverColors = {
  [Direction.Buy]: 'red',
  [Direction.Sell]: 'blue'
}

export const TradeButton = styled('button')<{ direction: string }>`
  background-color: ${({ theme }) => theme.priceButton.backgroundColor};
  border-radius: 3px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0.75rem 1.5rem;

  .spot-tile:hover & {
    background-color: ${({ theme }) => theme.priceButton.hoverColor};
  }

  .spot-tile:hover &:hover {
    background-color: ${({ theme, direction }) => theme[hoverColors[direction]].base};
    color: ${({ theme }) => theme.priceButton.textColor};
  }
`

const Box = styled('div')`
  padding: 0;
  margin: 0;
`

const DirectionLabel = styled(Box)`
  opacity: 0.59;
  margin: 0 0 0.125rem 0;
  font-size: 0.625rem;
`

const Big = styled(Box)`
  font-size: 0.8125rem;
  line-height: 1rem;
`

const Pip = styled(Box)`
  font-size: 2.125rem;
  line-height: 2.5rem;
  margin: 0 0.125rem;
`

const Tenth = styled(Box)`
  margin: 0.125rem 0;
  align-self: flex-end;
`

interface PriceButtonProps {
  big?: number
  pip?: number
  tenth?: number
  rawRate?: number
  direction?: Direction
  handleClick?: (direction: Direction) => void
}

const renderPips = (pips: number) => (pips.toString().length === 1 ? `0${pips}` : pips)
const getBigFigureDisplay = (bigFigure: number, rawRate: number) =>
  bigFigure === Math.floor(rawRate) ? `${bigFigure}.` : bigFigure.toString()
const renderBigFigureDisplay = (bigFigureDisplay: string) =>
  bigFigureDisplay.toString().length === 3 ? `${bigFigureDisplay}0` : bigFigureDisplay

const PriceButtonComp: React.SFC<PriceButtonProps> = ({
  big = 0,
  pip = 0,
  tenth = 0,
  rawRate = 0,
  direction = Direction.Buy,
  handleClick = () => {}
}) => {
  const bigFigure = getBigFigureDisplay(big, rawRate)
  return (
    <TradeButton direction={direction} onClick={() => handleClick(direction)}>
      <Flex height="34px" direction="row" justifyContent="center" alignItems="center">
        <Flex height="100%" direction="column" justifyContent="center">
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big>{renderBigFigureDisplay(bigFigure)}</Big>
        </Flex>
        <Pip>{renderPips(pip)}</Pip>
        <Tenth>{tenth}</Tenth>
      </Flex>
    </TradeButton>
  )
}

export default PriceButtonComp
