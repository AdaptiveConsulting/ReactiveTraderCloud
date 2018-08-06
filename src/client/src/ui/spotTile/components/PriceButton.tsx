import React, { SFC } from 'react'
import { Flex } from 'rt-components'
import { Direction } from 'rt-types'
import { styled, withDefaultProps } from 'rt-util'

const hoverColors = {
  [Direction.Buy]: 'accentBad',
  [Direction.Sell]: 'accentPrimary'
}

export const TradeButton = styled('button')<{ direction: string }>`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  border-radius: 3px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 10px 24px;

  ._spot-tile:hover & {
    background-color: ${({ theme: { background } }) => background.backgroundPrimary};
  }

  ._spot-tile:hover &:hover {
    background-color: ${({ theme: { palette }, direction }) => palette[hoverColors[direction]].light};
  }
`

const Box = styled('div')`
  padding: 0;
  margin: 0;
`

const DirectionLabel = styled(Box)`
  color: ${({ theme: { text } }) => text.textMeta};
  margin: 0 0 2px 0;
  font-size: 10px;
`

const Big = styled(Box)`
  color: ${({ theme: { text } }) => text.textPrimary};
  font-size: ${p => p.theme.fontSize.h4};
`

const Pip = styled(Box)`
  color: ${({ theme: { text } }) => text.textPrimary};
  font-size: ${p => p.theme.fontSize.h2};
  margin: 0 2px;
`

const Tenth = styled(Box)`
  color: ${({ theme: { text } }) => text.textPrimary};
  margin: 2px 0;
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

const PriceButtonComp: SFC<PriceButtonProps> = ({ big, pip, tenth, rawRate, direction, handleClick }) => {
  const bigFigure = getBigFigureDisplay(big, rawRate)
  return (
    <TradeButton direction={direction} onClick={() => handleClick(direction)} className="price-button">
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
