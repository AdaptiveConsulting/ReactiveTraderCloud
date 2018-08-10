import React from 'react'
import { Flex } from 'rt-components'
import { Direction } from 'rt-types'
import { styled, withDefaultProps } from 'rt-util'

const hoverColors = {
  [Direction.Buy]: '#F94C4C',
  [Direction.Sell]: '#5f94f5'
}

export const TradeButton = styled('button')<{ direction: string }>`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  color: ${({ theme: { text } }) => text.textPrimary};
  border-radius: 3px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0.5rem 1.5rem;

  .spot-tile:hover & {
    background-color: ${({ theme: { background } }) => background.backgroundPrimary};
  }

  .spot-tile:hover &:hover {
    background-color: ${({ direction }) => hoverColors[direction]};
    color: ${({ theme: { text } }) => text.white};
  }
`

const Box = styled('div')`
  padding: 0;
  margin: 0;
`

const DirectionLabel = styled(Box)`
  color: ${({ theme: { text } }) => text.textMeta};
  margin: 0 0 0.125rem 0;
  font-size: 0.625rem;
`

const Big = styled(Box)`
  font-size: ${p => p.theme.fontSize.h4};
`

const Pip = styled(Box)`
  font-size: ${p => p.theme.fontSize.h2};
  margin: 0 0.125rem;
`

const Tenth = styled(Box)`
  margin: 0.125rem 0;
  align-self: flex-end;
`
const defaultProps: PriceButtonProps = {
  big: 0,
  pip: 0,
  tenth: 0,
  rawRate: 0,
  direction: Direction.Buy,
  handleClick: () => {}
}

interface PriceButtonProps {
  big: number
  pip: number
  tenth: number
  rawRate: number
  direction: Direction
  handleClick: (direction: Direction) => void
}

const renderPips = (pips: number) => (pips.toString().length === 1 ? `0${pips}` : pips)
const getBigFigureDisplay = (bigFigure: number, rawRate: number) =>
  bigFigure === Math.floor(rawRate) ? `${bigFigure}.` : bigFigure.toString()
const renderBigFigureDisplay = (bigFigureDisplay: string) =>
  bigFigureDisplay.toString().length === 3 ? `${bigFigureDisplay}0` : bigFigureDisplay

const PriceButtonComp: React.SFC<PriceButtonProps> = ({ big, pip, tenth, rawRate, direction, handleClick }) => {
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

export default withDefaultProps(defaultProps, PriceButtonComp)
