import { userSelectButton } from "@/styleguide/rules"
import { Theme, TouchableIntentName } from "@/theme"
import styled, { css } from "styled-components"

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

export const Button: React.FC<ButtonStyleProps> = (props) => {
  return (
    <StyledButton {...props}>
      <span>{props.children}</span>
    </StyledButton>
  )
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

export default Button
