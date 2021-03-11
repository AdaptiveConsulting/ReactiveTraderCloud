import { keyframes, css } from "styled-components"
import styled from "styled-components"
import { Theme } from "@/theme/themes"
import { Direction } from "@/services/trades"

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

const getAnimationCSSProperty = (props: {
  direction: Direction
  theme: Theme
}) => css`
  animation: ${backgroundEffectKeyframes(props)} 5s;
`

const backgroundEffect = ({
  priceAnnounced,
  ...rest
}: {
  priceAnnounced: boolean
}) =>
  priceAnnounced
    ? getAnimationCSSProperty(rest as { direction: Direction; theme: Theme })
    : ""

export const TradeButton = styled.button<{
  direction: Direction
  priceAnnounced: boolean
  expired?: boolean
}>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 3px;
  color: ${({ theme }) => theme.core.textColor};
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  height: 62px;
  min-width: 75px;
  padding: ${({ expired }) =>
    expired ? "0.6rem 1.5rem 0.4rem 1.5rem" : "0.55rem 1.5rem 0.6rem 1.5rem"};
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
const Box = styled.div`
  padding: 0;
  margin: 0;
`

export const DirectionLabel = styled(Box)<{ priceAnnounced?: boolean }>`
  opacity: 0.59;
  margin: 0 0 0.125rem 0;
  font-size: 0.625rem;

  color: ${({ priceAnnounced, theme }) =>
    priceAnnounced ? theme.secondary.base : theme.secondary[1]};
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
  height: 2.1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`
export const QuotePriceLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  font-size: 10px;
  transition: background-color 0.2s ease;
  height: 58px;
  min-height: 2rem;
  max-height: 3.7rem;
  margin-bottom: 1px;
  min-width: 125px;
  line-height: normal;
  opacity: 0.5;
  text-align: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.primary[5]};
  font-weight: 400;
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`

export const ExpiredPrice = styled.div`
  color: ${({ theme }) => theme.colors.spectrum.uniqueCollections.Sell.base};
  font-size: 8px;
  text-transform: uppercase;
  height: 0;
  animation: ${fadeOut} 1s linear;
  transition: visibility 1s linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
`
