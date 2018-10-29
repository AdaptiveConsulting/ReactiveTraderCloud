import _ from 'lodash'
import React, { ButtonHTMLAttributes } from 'react'

import { css, resolvesColor, styled, Styled, Theme, ThemeProvider } from 'rt-theme'

import { userSelectButton, userSelectNone } from 'rt-styleguide'

export interface ButtonStyleProps {
  intent?: string
  active?: boolean
  outline?: boolean
  disabled?: boolean
  pill?: boolean
  size?: number
  invert?: boolean
}

const boxShadow = `0 0.25rem 0.375rem rgba(50, 50, 93, 0.11), 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08)`

class ButtonThemeProvider extends React.Component<ButtonStyleProps> {
  static defaultProps = {
    intent: 'primary',
  }

  resolveTheme = (providedTheme: Theme) => {
    const { intent, outline, active, disabled, invert } = this.props

    const { backgroundColor, textColor, button: theme, colors } = providedTheme
    let {
      button: { [intent]: palette = { backgroundColor, textColor } },
    } = providedTheme

    if (active) {
      palette = { ...palette, ...palette.active }
    }

    if (disabled) {
      // We might prefer to set the disabled palette explicitly
      // and not rely on opacity — as will be done with no change
      // palette = { ...palette, ...palette.disabled }
    }

    if (invert) {
      palette = {
        ...palette,
        backgroundColor: palette.textColor,
        textColor: palette.backgroundColor,
        ..._.map(palette, ({ backgroundColor, textColor }) => ({
          textColor: backgroundColor,
          backgroundColor: textColor,
        })),
      }
    }

    if (outline) {
      palette = {
        ...palette,
        backgroundColor: colors.spectrum.transparent,
        textColor: palette.backgroundColor,
        active: {
          backgroundColor: palette.backgroundColor,
          textColor: palette.textColor || textColor,
        },
      }
    }

    return {
      button: palette,
      ...theme,
      ...theme.primary,
      ...palette,
    }
  }

  render() {
    const { children } = this.props

    return <ThemeProvider theme={this.resolveTheme}>{children}</ThemeProvider>
  }
}

export class Button extends React.Component<ButtonStyleProps & ButtonHTMLAttributes<Element>> {
  render() {
    const { children, intent, active, disabled, outline, invert, pill, size, ...rest } = this.props
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

export class ButtonGroup extends React.Component<ButtonStyleProps> {
  render() {
    const { children, intent, active, disabled, outline, pill, size, ...rest } = this.props
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

const StyledBase: Styled<ButtonStyleProps> = styled.div`
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

  background-color: ${resolvesColor('backgroundColor')};
  color: ${resolvesColor('textColor')};

  transition: background-color 150ms ease;

  box-shadow: ${boxShadow};

  &,
  &::before,
  &::after {
    border-radius: 0.25rem;
  }

  ${({ size }) => {
    return !size || size <= 1
      ? ''
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

const StyledButtonBase = StyledBase.withComponent('button')
export const StyledButton: Styled<ButtonStyleProps> = styled(StyledButtonBase)`
  width: max-content;
  min-width: 4rem;
  max-width: 26rem;
  min-height: 1.75rem;
  max-height: 1.75rem;

  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  &:active ${({ active }) => (active ? ', &' : '')} {
    background-color: ${resolvesColor('active.backgroundColor')};
    * {
      color: ${resolvesColor('active.textColor')};
    }
  }

  ${({ size }) =>
    (size || size > 1) &&
    css`
      padding-top: ${((size + 1) / 2) * 0.75}rem;
      padding-bottom: ${((size + 1) / 2) * 0.75}rem;
      padding-left: ${size * 0.75}rem;
      padding-right: ${size * 0.75}rem;
    `};

  ${props => userSelectButton(props)};
`
StyledButton.defaultProps = {
  role: 'button',
}

export const StyledButtonGroup: Styled<ButtonStyleProps> = styled(StyledBase)`
  ${StyledButton} {
    min-width: 1rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    border-radius: 0;
    margin-top: 0;
    margin-bottom: 0;
    box-shadow: none;

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
        box-shadow:
          -0.0625rem 0 0 currentColor inset,
          0.0625rem 0 0 currentColor inset
        ;
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      ${userSelectNone};
    `};
  )
`

StyledButtonGroup.defaultProps = {
  role: 'group',
}

export default Button
