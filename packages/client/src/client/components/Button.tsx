import { PropsWithChildren } from "react"
import styled, { css } from "styled-components"

import { Typography } from "./Typography"

interface Props {
  variant: "brand" | "primary" | "warning"
  size: "xs" | "sm" | "lg"
  disabled?: boolean
  onClick: () => void
}

const focused = css`
  &:focus {
    outline: 2px solid
      ${({ theme }) =>
        theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
    outline-offset: 1px;
  }
`

const disabledStyle = css`
  ${({ theme }) => `
    background-color: ${theme.newTheme.color["Colors/Background/bg-disabled"]};
    color: ${theme.newTheme.color["Colors/Text/text-disabled"]};
    `}
`

const brandStyle = css`
  ${({ theme }) => `
  color: ${theme.newTheme.color["Component colors/Components/Buttons/Brand/button-brand-fg"]};
  background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Brand/button-brand-bg"]};
  
  &:hover {
    color: ${theme.newTheme.color["Component colors/Components/Buttons/Brand/button-brand-fg_hover"]};
    background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Brand/button-brand-bg_hover"]};
  }
  ${focused}
`}
`
const primaryStyle = css`
  ${({ theme }) => `
  color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-fg"]};
  background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
  
  &:hover {
    color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
    background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-bg_hover"]};
  }
  ${focused}
`}
`
const warningStyle = css`
  ${({ theme }) => `
  color: ${theme.newTheme.color["Colors/Text/text-primary (900)"]};
  background-color: ${theme.newTheme.color["Colors/Background/bg-warning-primary"]};
  
  &:hover {
    color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
    background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
    border: 1px solid ${theme.newTheme.color["Colors/Border/border-warning_subtle"]};
  }
  ${focused}
`}
`

const _Button = styled.button<Props>`
  padding: 0 ${({ theme }) => theme.newTheme.spacing.xl};
  border-radius: ${({ theme }) => theme.newTheme.radius.full};
  ${({ theme, size }) => {
    switch (size) {
      case "xs":
        return `height: ${theme.newTheme.density.xs};`
      case "sm":
        return `height: ${theme.newTheme.density.sm};`
      case "lg":
        return `height: ${theme.newTheme.density.md};`
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
      case "warning":
        return warningStyle
    }
  }};
`

export const Button = ({ children, ...props }: PropsWithChildren<Props>) => {
  return (
    <_Button {...props}>
      <Typography variant="Text sm/Semibold">{children}</Typography>
    </_Button>
  )
}
