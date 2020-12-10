import styled, { keyframes, css } from 'styled-components/macro'
import { Direction } from 'services/trades'
import { Theme } from 'theme/themes'

export const TileHeader = styled.div`
  display: flex;
  align-items: center;
`

export const TileSymbol = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`
export const DeliveryDate = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
  margin-left: auto;
  transition: margin-right 0.2s;
`
export const TopRightButton = styled('button')`
  position: absolute;
  right: 1rem;
  top: 0.995rem;
  opacity: 0;
  transition: opacity 0.2s;
  &:hover {
    .hover-state {
      fill: #5f94f5;
    }
  }
`

export const ActionButton = styled('button')`
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid white;
`
const backgroundEffectKeyframes = ({
    direction,
    theme,
  }: {
    direction: Direction
    theme: Theme
  }) => keyframes`
    5% {
      background-color: ${theme.colors.spectrum.uniqueCollections[direction].base};
      color: white;
    }
    80% {
      background-color: ${theme.colors.spectrum.uniqueCollections[direction].base};
      color: white;
    }
  `
  
const getAnimationCSSProperty = (props: { direction: Direction; theme: Theme }) => css`
    animation: ${backgroundEffectKeyframes(props)} 5s;
`

const backgroundEffect = ({ priceAnnounced, ...rest }: { priceAnnounced: boolean }) =>
  priceAnnounced ? getAnimationCSSProperty(rest as { direction: Direction; theme: Theme }) : ''

export const TradeButton = styled.button<{
    direction: Direction
    priceAnnounced: boolean
    isAnalyticsView: boolean
    expired?: boolean
  }>`
    background-color: ${({ theme }) => theme.core.lightBackground};
    border-radius: 3px;
    color: ${({ theme, priceAnnounced, direction }) =>
      priceAnnounced ? theme.colors.spectrum.uniqueCollections[direction].base : 'inherit'};
    transition: background-color 0.2s ease;
    cursor: pointer;
    border: none;
    outline: none;
    height: 59px;
    min-width: 125px;
    padding: ${({ expired }) =>
      expired ? '0.6rem 1.5rem 0.4rem 1.5rem' : '0.55rem 1.5rem 0.6rem 1.5rem'};
    margin-bottom: 2px;
    ${backgroundEffect}
  
    ${({ theme, direction, disabled, priceAnnounced }) =>
      disabled && !priceAnnounced
        ? `
    cursor: initial;
    pointer-events: none;
      `
        : `
  
    &:hover {
      background-color: ${theme.colors.spectrum.uniqueCollections[direction].base} !important;
      color: ${theme.white};
    }
    `};
    `

export const InputWrapper = styled.div`
    display: grid;
    grid-template-columns: 30px auto 30px;
    grid-template-areas: 'Currency Input ResetInputValue' '. Message .';
    align-items: center;
    
    grid-template-rows: 23px 13px;
    margin-bottom: -0.5rem;
    `

export const CurrencyPairSymbol = styled('span')`
    grid-area: Currency;
    opacity: 0.59;
    font-size: 0.625rem;
    line-height: 1.2rem;
    `

export const ResetInputValue = styled.button`
    background-color: ${({ theme }) => theme.core.lightBackground};
    border: 2px solid ${({ theme }) => theme.core.darkBackground};
    border-radius: 3px;
    margin-left: 8px;
    grid-area: ResetInputValue;
    font-size: 0.625rem;
    line-height: 1.2rem;
`

export const Input = styled.input`
    grid-area: Input;
    background: none;
    text-align: center;
    outline: none;
    border: none;
    font-size: 0.75rem;
    width: 80px;
    padding: 2px 0;
    caret-color: ${({ theme }) => theme.primary.base};
`
const RouteStyle = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  /* When in Finsemble a 25px header is injected,
   this resets body to the correct height */
  height: 100%;
`

export const TileBaseStyle = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;

  &:hover ${TradeButton} {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  ${RouteStyle} & {
    border-radius: 0px;
  }
`

export const TileWrapperBase = styled.div<{ shouldMoveDate: boolean }>`
  position: relative;
  &:hover ${TopRightButton} {
    opacity: 0.75;
  }
  &:hover ${DeliveryDate} {
    margin-right: ${({ shouldMoveDate }) => (shouldMoveDate ? '1.3rem' : '0')};
  }
  &:hover ${ActionButton} {
    opacity: 0.75;
  }
  color: ${({ theme }) => theme.core.textColor};
`
