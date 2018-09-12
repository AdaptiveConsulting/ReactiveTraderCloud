import _ from 'lodash'
import React from 'react'
import { styled, css, ThemeProvider } from 'rt-theme'
import mapProps from '@evanrs/map-props'

import { resolvesColor } from 'rt-theme/tools'
import { mapMarginPaddingProps, userSelectButton } from './rules'

const rules = {
  boxShadow: css`
    0 0.25rem 0.375rem rgba(50, 50, 93, 0.11), 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08)
  `
}

class ButtonThemeProvider extends React.Component {
  static defaultProps = {
    intent: 'primary'
  }

  resolveTheme = providedTheme => {
    const { intent, outline, active, disabled } = this.props
    let {
      backgroundColor,
      textColor,
      button: theme,
      button: { [intent]: palette = { backgroundColor, textColor } },
      colors
    } = providedTheme

    if (active) {
      palette = { ...palette, ...palette.active }
    }

    // if (disabled) {
    //   palette = { ...palette, ...palette.disabled };
    // }

    if (outline) {
      palette = {
        ...palette,
        backgroundColor: colors.transparent,
        textColor: palette.backgroundColor,
        active: {
          backgroundColor: palette.backgroundColor,
          textColor: palette.textColor || textColor
        }
      }
    }

    return {
      button: palette,
      ...theme,
      ...theme.primary,
      ...palette
    }
  }

  render() {
    const { children } = this.props

    return <ThemeProvider theme={this.resolveTheme}>{children}</ThemeProvider>
  }
}

class Button extends React.Component {
  render() {
    const { children, active, disabled, outline, ...props } = this.props

    return (
      <ButtonThemeProvider {...this.props}>
        <StyledButton {...{ active, disabled, outline }} {...this.props}>
          <span>{children}</span>
        </StyledButton>
      </ButtonThemeProvider>
    )
  }
}

export class ButtonGroup extends React.Component {
  render() {
    const { active, disabled, outline, children, ...props } = this.props

    return (
      <ButtonThemeProvider {...this.props}>
        <StyledButtonGroup {...{ active, disabled, outline, children }} {...this.props} />
      </ButtonThemeProvider>
    )
  }
}

export const mapButtonProps = mapProps({
  pill: css`
    &,
    &::before,
    &::after {
      border-radius: 2rem;
    }
  `,

  outline: css`
    position: relative;
    z-index: 1;

    box-shadow: ${rules.boxShadow}, 0 0 0 0.125rem currentColor inset;

    *,
    & {
      transition: background-color 80ms ease, color 180ms ease;
    }
  `,

  // FIXME: why disabled button boo works?
  disabled: css`
    pointer-events: none;
    opacity: 0.5;
  `
})

const BaseElement = styled.div`
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

  box-shadow: ${rules.boxShadow};

  &,
  &::before,
  &::after {
    border-radius: 0.25rem;
  }

  ${mapButtonProps};
  ${mapMarginPaddingProps};
`

export const StyledButton = styled(BaseElement)`
  width: min-content;
  min-width: 4rem;
  max-width: 26rem};
  min-height:  1.75rem;
  max-height: 1.75rem;

  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  &,
  &::before,
  &::after {
    border-radius: 0.25rem;
  }

  &:active ${({ active }) => (active ? ', &' : '')} {
    background-color: ${resolvesColor('active.backgroundColor')};
    * {
      color: ${resolvesColor('active.textColor')};
    }
  }

  ${userSelectButton}
`

export const StyledButtonGroup = styled(BaseElement)`
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

  ${mapProps({
    pill: css`
      ${StyledButton}:first-child {
        border-radius: 2rem 0 0 2rem;
        padding-left: 0.875rem;
      }
      ${StyledButton} + ${StyledButton}:last-child {
        border-radius: 0 2rem 2rem 0;
        padding-right: 0.875rem;
      }
    `,

    outline: css`
      box-shadow: ${rules.boxShadow}, 0 0 0 0.125rem currentColor inset;

      ${StyledButton} {
        box-shadow: -0.0625rem 0 0 currentColor inset;
      }
      ${StyledButton} + ${StyledButton} {
        box-shadow:
          -0.0625rem 0 0 currentColor inset,
          0.0625rem 0 0 currentColor inset
        ;
      }
    `
  })};
`

export default Button
