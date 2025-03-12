import React, { PropsWithChildren } from "react"
import styled, { css } from "styled-components"

import { Typography } from "./Typography"

interface Props {
  variant: "brand" | "primary" | "warning" | "outline" | "white-outline"
  size: "xxs" | "xs" | "sm" | "lg"
  className?: string
  disabled?: boolean
  style?: React.CSSProperties
  onClick: () => void
}

const focus = css`
  outline: 2px solid
    ${({ theme }) => theme.color["Colors/Effects/Focus rings/focus-ring"]};
  outline-offset: 2px;
`

const disabledStyle = css`
  ${({ theme }) => `
    background-color: ${theme.color["Colors/Background/bg-disabled"]};
    color: ${theme.color["Colors/Text/text-disabled"]};
    `}
`

const brandStyle = css`
  ${({ theme }) => `
  color: ${theme.color["Component colors/Components/Buttons/Brand/button-brand-fg"]};
  background-color: ${theme.color["Component colors/Components/Buttons/Brand/button-brand-bg"]};
  `}

  &:hover,
  &.sg-button-hover {
    ${({ theme }) => `  
    color: ${theme.color["Component colors/Components/Buttons/Brand/button-brand-fg_hover"]};
    background-color: ${theme.color["Component colors/Components/Buttons/Brand/button-brand-bg_hover"]};
    `}
  }
`

const primaryStyle = css`
  ${({ theme }) => `
  color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-fg"]};
  background-color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
  `}
  &:hover,
  &.sg-button-hover {
    ${({ theme }) => `
    color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
    background-color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-bg_hover"]};
    `}
  }
`

const outlineStyle = css`
  ${({ theme }) => `
  color: ${theme.color["Colors/Text/text-brand-primary (900)"]};
  border: 1px solid ${theme.color["Colors/Border/border-brand"]};
  `}
  &:hover,
  &.sg-button-hover {
    opacity: 0.65; // TODO Talk to UX about getting border hover colors
  }
`

const warningStyle = css`
  ${({ theme }) => `
  color: ${theme.color["Colors/Text/text-primary (900)"]};
  background-color: ${theme.color["Colors/Background/bg-warning-primary"]};
  `}
  &:hover,
  &.sg-button-hover {
    ${({ theme }) => `
    color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
    background-color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
    border: 1px solid ${theme.color["Colors/Border/border-warning_subtle"]};

    `}
  }
`

const whiteOutlineStyle = css`
  ${({ theme }) => `
  color: ${theme.color["Colors/Text/text-white"]};
  border: 1px solid ${theme.color["Colors/Text/text-white"]};
  `}
  &:hover,
  &.sg-button-hover {
    ${({ theme }) => `
    color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
    background-color: ${theme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
    `}
  }
`

const ButtonStyled = styled.button<Props>`
  padding: 0 ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.full};

  &:focus,
  &.sg-button-focus {
    ${focus}
  }

  ${({ theme, size }) => {
    switch (size) {
      case "xxs":
        return `height: 18px;
                padding: 0 ${theme.spacing.sm};
                `
      case "xs":
        return `height: ${theme.density.xs};`
      case "sm":
        return `height: ${theme.density.sm};`
      case "lg":
        return `height: ${theme.density.md};`
    }
  }}
  ${({ variant, disabled }) => {
    if (disabled) {
      return disabledStyle
    }
    switch (variant) {
      case "brand":
        return brandStyle
      case "primary":
        return primaryStyle
      case "outline":
        return outlineStyle
      case "warning":
        return warningStyle
      case "white-outline":
        return whiteOutlineStyle
    }
  }};
`

export const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<Props>
>(function ButtonInner({ children, className, ...props }, ref) {
  return (
    <ButtonStyled ref={ref} className={className} {...props}>
      <Typography
        variant={props.size === "xxs" ? "Text xxs/Regular" : "Text sm/Semibold"}
      >
        {children}
      </Typography>
    </ButtonStyled>
  )
})
