import React from 'react'
import { styled } from 'rt-theme'
import { Direction } from 'rt-types'
import { keyframes, css } from 'styled-components'
import { RfqState } from './types'

const hoverColors = {
  [Direction.Buy]: 'blue',
  [Direction.Sell]: 'red',
}

const backgroundEffectKeyframes = (props: any) => keyframes`
  5% {
    background-color: ${props.theme.template[hoverColors[props.direction]].normal};
  }
  80% {
    background-color: ${props.theme.template[hoverColors[props.direction]].normal};
  }
`

const getCSSProperty = (props: any) => css`
  animation: ${backgroundEffectKeyframes(props)} 5s;
`

const backgroundEffect = (props: any) =>
  props.rfqState === 'received' ? getCSSProperty(props) : ''

// TODO Fix animation to make sure hover still works after
export const TradeButton = styled.button<{ direction: Direction; rfqState: RfqState }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 3px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2px;
  ${backgroundEffect}

  ${({ theme, direction, disabled, rfqState }) =>
    disabled && rfqState !== 'received'
      ? `
  cursor: initial;
  opacity: 0.3;
  pointer-events: none;
    `
      : `
  .spot-tile:hover & {
    background-color: ${theme.core.darkBackground};
  }
  .spot-tile:hover &:hover {
    background-color: ${theme.template[hoverColors[direction]].normal};
    color: ${theme.template.white.normal};
  }
  `};
`

const Box = styled.div`
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

const Price = styled.div`
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BigWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

interface PriceButtonProps {
  big?: number
  pip?: number
  tenth?: number
  rawRate?: number
  direction?: Direction
  handleClick?: () => void
  rfqState?: RfqState
  disabled?: boolean
}

const renderPips = (pips: number) => (pips.toString().length === 1 ? `0${pips}` : pips)
const getBigFigureDisplay = (bigFigure: number, rawRate: number) =>
  bigFigure === Math.floor(rawRate) ? `${bigFigure}.` : bigFigure.toString()
const renderBigFigureDisplay = (bigFigureDisplay: string) =>
  bigFigureDisplay.toString().length === 3 ? `${bigFigureDisplay}0` : bigFigureDisplay

const PriceButtonComp: React.FC<PriceButtonProps> = ({
  big = 0,
  pip = 0,
  tenth = 0,
  rawRate = 0,
  direction = Direction.Buy,
  handleClick = () => {},
  rfqState,
  disabled = false,
}) => {
  const bigFigure = getBigFigureDisplay(big, rawRate)
  return (
    <TradeButton
      direction={direction}
      onClick={() => handleClick()}
      rfqState={rfqState}
      disabled={disabled}
    >
      <Price>
        <BigWrapper>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big>{renderBigFigureDisplay(bigFigure)}</Big>
        </BigWrapper>
        <Pip>{renderPips(pip)}</Pip>
        <Tenth>{tenth}</Tenth>
      </Price>
    </TradeButton>
  )
}

export default PriceButtonComp
