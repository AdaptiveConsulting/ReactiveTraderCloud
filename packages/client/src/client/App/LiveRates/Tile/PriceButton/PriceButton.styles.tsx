import styled, { css, DefaultTheme, keyframes } from "styled-components"

import { isBuy } from "@/client/App/Credit/common"
import { Stack } from "@/client/components/Stack"
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
    background-color: ${getDirectionColor(theme, direction)};
    color: ${theme.color["Colors/Text/text-primary (900)"]};
  }
  80% {
    background-color: ${getDirectionColor(theme, direction)};
    color: ${theme.color["Colors/Text/text-primary (900)"]};
  }
`

const getAnimationCSSProperty = (props: {
  direction: Direction
  theme: Theme
}) => css`
  animation: ${backgroundEffectKeyframes(props)} 5s;
`

const getDirectionColor = (theme: DefaultTheme, direction: Direction) =>
  isBuy(direction)
    ? theme.color["Colors/Background/bg-buy-primary"]
    : theme.color["Colors/Background/bg-sell-primary"]

type TradeButtonProps = {
  direction: Direction
  priceAnnounced: boolean
  isStatic?: boolean
  isExpired?: boolean
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
        color: ${theme.color["Colors/Text/text-primary (900)"]};
        `
      : ""

const buttonDimensions = css`
  height: 60px;
  width: 88px;
`

const SharedButtonStyle = styled.button`
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.xxs};
`

export const TradeButton = styled(SharedButtonStyle)<TradeButtonProps>`
  position: relative;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  color: ${({ theme, priceAnnounced, direction }) =>
    priceAnnounced ? getDirectionColor(theme, direction) : "inherit"};
  .symbol {
    color: ${({ theme, priceAnnounced, disabled }) => {
      if (priceAnnounced) {
        return theme.color["Colors/Text/text-primary (900)"]
      }
      if (disabled) {
        return theme.color["Colors/Text/text-disabled"]
      }
      return theme.color["Colors/Text/text-tertiary (600)"]
    }};
  }
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  ${backgroundEffect}

  ${({ isStatic, theme, direction }) =>
    isStatic
      ? `
        background-color: ${getDirectionColor(theme, direction)};
        color: ${theme.color["Colors/Text/text-primary (900)"]};
      `
      : ``}

  ${({ theme, direction, disabled, priceAnnounced }) =>
    disabled && !priceAnnounced
      ? `
        cursor: initial;
        pointer-events: none;
  `
      : `
        &:hover {
          background-color: ${getDirectionColor(theme, direction)};
          color: ${theme.color["Colors/Text/text-primary (900)"]};
          .symbol {
            color: ${theme.color["Colors/Text/text-primary (900)"]};
          }
        }
    `};
`

export const QuotePriceLoading = styled(SharedButtonStyle)`
  transition: background-color 0.2s ease;
  opacity: 0.5;
  margin: 0;
`

export const PriceButtonDisabledPlaceholder = styled(Stack)`
  border: 1px solid
    ${({ theme }) => theme.color["Colors/Border/border-disabled"]};
  ${buttonDimensions}
  color: ${({ theme }) => theme.color["Colors/Text/text-disabled"]};
  border-radius: 3px;
  transition: background-color 0.2s ease;
  text-align: center;
`
