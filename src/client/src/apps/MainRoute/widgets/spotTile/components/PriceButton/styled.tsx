import { styled, Theme } from 'rt-theme'
import { Direction } from 'rt-types'
import { keyframes, css } from 'styled-components'

const hoverColors = {
  [Direction.Buy]: 'blue',
  [Direction.Sell]: 'red',
}

const backgroundEffectKeyframes = ({
  direction,
  theme,
}: {
  direction: Direction
  theme: Theme
}) => keyframes`
  5% {
    background-color: ${theme.template[hoverColors[direction]].normal};
    color: white;
  }
  80% {
    background-color: ${theme.template[hoverColors[direction]].normal};
    color: white;
  }
`

const getAnimationCSSProperty = (props: { direction: Direction; theme: Theme }) => css`
  animation: ${backgroundEffectKeyframes(props)} 5s;
`

const backgroundEffect = ({ priceAnnounced, ...rest }: { priceAnnounced: boolean }) =>
  priceAnnounced ? getAnimationCSSProperty(rest as { direction: Direction; theme: Theme }) : ''

export const TradeButton = styled.button<{ direction: Direction; priceAnnounced: boolean }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 3px;
  color: ${({ theme, priceAnnounced, direction }) =>
    priceAnnounced ? theme.template[hoverColors[direction]].normal : 'inherit'};
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  width: 122px;
  min-width: 122px;
  height: 59px;
  min-height: 59px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2px;
  ${backgroundEffect}

  ${({ theme, direction, disabled, priceAnnounced }) =>
    disabled && !priceAnnounced
      ? `
  cursor: initial;
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

export const DirectionLabel = styled(Box)`
  opacity: 0.59;
  margin: 0 0 0.125rem 0;
  font-size: 0.625rem;
`

export const Big = styled(Box)`
  font-size: 0.8125rem;
  line-height: 1rem;
`

export const Pip = styled(Box)`
  font-size: 2.125rem;
  line-height: 2.5rem;
  margin: 0 0.125rem;
`

export const Tenth = styled(Box)`
  margin: 0.125rem 0;
  align-self: flex-end;
`

export const Price = styled.div<{ disabled: boolean }>`
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ disabled }) => (disabled ? 'opacity: 0.3' : '')}
`

export const BigWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const ExpiredPrice = styled.div`
  color: ${({ theme }) => theme.template.red.normal};
  font-size: 9px;
  text-transform: uppercase;
`
