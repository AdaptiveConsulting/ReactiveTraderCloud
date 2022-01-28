import { Component, ButtonHTMLAttributes, ReactChild } from "react"
import styled, { css, ThemeProvider, withTheme } from "styled-components"
import { Theme, TouchableIntentName } from "@/theme"
import { userSelectButton, userSelectNone } from "../rules"

export interface ButtonStyleProps {
  intent?: TouchableIntentName
  active?: boolean
  outline?: boolean
  disabled?: boolean
  pill?: boolean
  size?: number
  invert?: boolean
}

const boxShadow = `0 0.25rem 0.375rem rgba(50, 50, 93, 0.11), 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08)`

function getButtonColors({
  theme,
  intent,
  outline,
  active,
  disabled,
  invert,
}: ButtonStyleProps & { theme: Theme }) {
  const buttonStyleSet = typeof intent !== "undefined" && theme.button[intent]

  let fg = (buttonStyleSet && buttonStyleSet.textColor) || theme.textColor
  let bg =
    (buttonStyleSet && buttonStyleSet.backgroundColor) || theme.backgroundColor

  if (active && buttonStyleSet) {
    bg = buttonStyleSet.active.backgroundColor
    fg = buttonStyleSet.active.textColor || fg
  }

  if (disabled && buttonStyleSet) {
    // Disabled flag only affects to opacity and pointer events - colors don't change
    bg = buttonStyleSet.disabled.backgroundColor
    fg = buttonStyleSet.disabled.textColor || theme.textColor
  }

  if (invert) {
    ;[fg, bg] = [bg, fg]
  }

  if (outline && buttonStyleSet) {
    if (active) {
      bg = buttonStyleSet.active.backgroundColor
      fg = buttonStyleSet.textColor || theme.textColor
    } else {
      bg = theme.colors.static.transparent
      fg = buttonStyleSet.backgroundColor
    }
  }

  return {
    ...theme,
    bg,
    fg,
  }
}

const bgColor = (props: ButtonStyleProps & { theme: Theme }) =>
  getButtonColors(props).bg
const fgColor = (props: ButtonStyleProps & { theme: Theme }) =>
  getButtonColors(props).fg

class BaseButtonThemeProvider extends Component<
  ButtonStyleProps & { theme: Theme }
> {
  static defaultProps = {
    intent: "primary",
  }

  render() {
    const { children, theme } = this.props
    return <ThemeProvider theme={theme}>{children as ReactChild}</ThemeProvider>
  }
}

const ButtonThemeProvider = withTheme(BaseButtonThemeProvider)

export class Button extends Component<
  ButtonStyleProps & ButtonHTMLAttributes<Element>
> {
  static defaultProps = {
    intent: "primary",
  }
  render() {
    const {
      children,
      intent,
      active,
      disabled,
      outline,
      invert,
      pill,
      size,
      ...rest
    } = this.props
    const props = {
      intent,
      active,
      outline,
      disabled,
      pill,
      size,
      invert,
    }

    return (
      <ButtonThemeProvider {...props}>
        <StyledButton {...props} {...rest}>
          <span>{children}</span>
        </StyledButton>
      </ButtonThemeProvider>
    )
  }
}

export class ButtonGroup extends Component<ButtonStyleProps> {
  render() {
    const { children, intent, active, disabled, outline, pill, size, ...rest } =
      this.props
    const props = {
      intent,
      active,
      outline,
      disabled,
      pill,
      size,
    }

    return (
      <ButtonThemeProvider {...props}>
        <StyledButtonGroup {...props} {...rest}>
          {children}
        </StyledButtonGroup>
      </ButtonThemeProvider>
    )
  }
}

const StyledBase = styled.div<ButtonStyleProps>`
  -webkit-appearance: none;
  border-width: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: min-content;

  margin-top: 0.375rem;
  margin-bottom: 0.375rem;

  line-height: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  overflow: hidden;

  background-color: ${bgColor};
  color: ${fgColor};

  transition: background-color 150ms ease;

  box-shadow: ${boxShadow};

  &,
  &::before,
  &::after {
    border-radius: 0.25rem;
  }

  ${({ size }) => {
    return !size || size <= 1
      ? ""
      : css`
          font-size: ${size * 0.5}rem;
          line-height: ${size * 1}rem;
        `
  }};

  ${({ pill }) =>
    pill &&
    css`
      border-radius: 2rem;

      &,
      &::before,
      &::after {
        border-radius: 2rem;
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `};

  ${({ outline }) =>
    outline &&
    css`
      position: relative;
      z-index: 1;

      box-shadow: ${boxShadow}, 0 0 0 0.125rem currentColor inset;

      *,
      & {
        transition: background-color 80ms ease, color 180ms ease;
      }
    `};
`

const StyledButtonBase = StyledBase.withComponent("button")
const StyledButton: any = styled(StyledButtonBase)<ButtonStyleProps>`
  width: max-content;
  min-width: 4rem;
  max-width: 26rem;
  min-height: 1.75rem;
  max-height: 1.75rem;

  padding-left: 0.75rem;
  padding-right: 0.75rem;

  &:active ${({ active }) => (active ? ", &" : "")} {
    background-color: ${({ active, ...props }) =>
      bgColor({ active: true, ...props })};
    box-shadow: ${boxShadow};
    * {
      color: ${({ active, ...props }) => fgColor({ active: true, ...props })};
    }
  }

  ${({ size }) =>
    size &&
    size > 1 &&
    css`
      padding-top: ${((size + 1) / 2) * 0.75}rem;
      padding-bottom: ${((size + 1) / 2) * 0.75}rem;
      padding-left: ${size * 0.75}rem;
      padding-right: ${size * 0.75}rem;
    `};

  ${(props) => userSelectButton(props)};
`
StyledButton.defaultProps = {
  role: "button",
}

const StyledButtonGroup: any = styled(StyledBase)<ButtonStyleProps>`
  ${StyledButton} {
    min-width: 1rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    border-radius: 0;
    margin-top: 0;
    margin-bottom: 0;
    box-shadow: none;
    background-color: ${bgColor};
    color: ${fgColor};

    &:active ${({ active }) => (active ? ", &" : "")} {
      background-color: ${(props) => bgColor({ ...props, active: true })};
      box-shadow: none;
      * {
        color: ${(props) => fgColor({ ...props, active: true })};
      }
    }
  }

  ${StyledButton}:first-child {
    border-radius: 0.25rem 0 0 0.25rem;
    padding-left: 0.6875rem;
  }
  ${StyledButton} + ${StyledButton}:last-child {
    border-radius: 0 0.25rem 0.25rem 0;
    padding-right: 0.6875rem;
  }

  ${({ pill }) =>
    pill &&
    css`
      ${StyledButton}:first-child {
        border-radius: 2rem 0 0 2rem;
        padding-left: 0.875rem;
      }
      ${StyledButton} + ${StyledButton}:last-child {
        border-radius: 0 2rem 2rem 0;
        padding-right: 0.875rem;
      }
    `};

  ${({ outline }) =>
    outline &&
    css`
      box-shadow: ${boxShadow}, 0 0 0 0.125rem currentColor inset;

      ${StyledButton} {
        box-shadow: -0.0625rem 0 0 currentColor inset;
      }
      ${StyledButton} + ${StyledButton} {
        box-shadow: -0.0625rem 0 0 currentColor inset,
          0.0625rem 0 0 currentColor inset;
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      ${userSelectNone};
    `};
`

StyledButtonGroup.defaultProps = {
  role: "group",
}

export default Button
