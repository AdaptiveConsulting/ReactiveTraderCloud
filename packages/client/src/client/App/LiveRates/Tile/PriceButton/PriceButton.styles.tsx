import styled, { css, DefaultTheme, keyframes } from "styled-components"

import { Theme } from "@/client/theme/themes"
import { Direction } from "@/generated/TradingGateway"

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

const getDirectionColor = (theme: DefaultTheme, direction: Direction) =>
  direction === Direction.Buy
    ? theme.newTheme.color["Colors/Background/bg-buy-primary"]
    : theme.newTheme.color["Colors/Background/bg-sell-primary"]

type TradeButtonProps = {
  direction: Direction
  priceAnnounced: boolean
  isStatic?: boolean
  expired?: boolean
  theme: Theme
}

const backgroundEffect = ({
  priceAnnounced,
  isStatic,
  direction,
  theme,
}: TradeButtonProps) =>
  priceAnnounced && !isStatic
    ? getAnimationCSSProperty({ direction, theme })
    : isStatic
      ? `
    background-color: ${getDirectionColor(theme, direction)};
    color: white;`
      : ""

export const TradeButton = styled.button<TradeButtonProps>`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  border-radius: 3px;
  color: ${({ theme, priceAnnounced, direction }) =>
    priceAnnounced ? getDirectionColor(theme, direction) : "inherit"};
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  height: 100%;
  min-width: 75px;
  padding: 0.6rem 1.5rem 0.9rem 1.5rem;
  ${backgroundEffect}
  ${({ isStatic, theme, direction }) =>
    isStatic
      ? `
    background-color: ${getDirectionColor(theme, direction)};
    color: white;`
      : ``}

  ${({ theme, direction, disabled, priceAnnounced }) =>
    disabled && !priceAnnounced
      ? `
  cursor: initial;
  pointer-events: none;
    `
      : `

  &:hover {
    background-color: ${getDirectionColor(theme, direction)} !important;
    color: ${theme.newTheme.color["Colors/Text/text-primary (900)"]};
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

const inlineBlock = css`
  display: inline;
`

export const PriceContainer = styled(Box)`
  padding-top: ${({ theme }) => theme.newTheme.spacing.md};
`

export const Big = styled(Box)`
  ${inlineBlock}
  font-size: 0.8125rem;
`

export const Pip = styled(Box)`
  ${inlineBlock}
  font-size: 2.125rem;
`

export const Tenth = styled(Box)`
  ${inlineBlock}
`

export const Price = styled.div<{ disabled: boolean }>`
  height: 2.1rem;
  display: flex;
  flex-direction: column;
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
  height: 100%;
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
  // animation: ${fadeOut} 1s linear;
  // transition: visibility 1s linear;
  // animation-fill-mode: forwards;
  // animation-delay: 1s;
`

export const Icon = styled.i`
  font-size: 20px;
  margin: 3px 0;
`

export const PriceButtonDisabledPlaceholder = styled.div`
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
  min-width: 100px;
  line-height: normal;
  opacity: 0.5;
  text-align: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.primary[5]};
  font-weight: 400;
`
