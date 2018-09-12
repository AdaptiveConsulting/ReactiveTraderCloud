import _ from 'lodash'
import React from 'react'
import { styled, css, ThemeProvider } from 'rt-theme'
import mapProps from '@evanrs/map-props'

import { resolvesColor } from 'rt-theme/tools'
import { mapMarginPaddingProps, userSelectButton } from './rules'

class TouchableOpacityThemeProvider extends React.Component {
  static defaultProps = {
    intent: 'primary'
  }

  resolveTheme = theme => resolveTheme(theme, this.props)

  render() {
    const { children } = this.props

    return <ThemeProvider theme={this.resolveTheme}>{children}</ThemeProvider>
  }
}

class TouchableOpacity extends React.Component {
  render() {
    const { children, active, disabled, ...props } = this.props

    return (
      <TouchableOpacityThemeProvider {...this.props}>
        <StyledTouchableOpacity {...{ active, disabled }} {...this.props}>
          <span>{children}</span>
        </StyledTouchableOpacity>
      </TouchableOpacityThemeProvider>
    )
  }
}

const BaseElement = styled.div`
  background-color: ${resolvesColor('backgroundColor')};
  color: ${resolvesColor('textColor')};

  transition: background-color 150ms ease;

  ${mapMarginPaddingProps};
`

export const StyledTouchableOpacity = styled(BaseElement)`
  &:active ${({ active }) => (active ? ', &' : '')} {
    background-color: ${resolvesColor('active.backgroundColor')};
    * {
      color: ${resolvesColor('active.textColor')};
    }
  }

  ${userSelectButton};
`

export const resolveTheme = (givenTheme, ownProps) => {
  const { intent, outline, active, disabled } = ownProps
  let {
    colors,
    backgroundColor,
    textColor,
    touchableOpacity: theme,
    touchableOpacity: { [intent]: palette = { backgroundColor, textColor } }
  } = givenTheme

  if (active) {
    palette = { ...palette, ...palette.active }
  }

  if (disabled) {
    palette = { ...palette, ...palette.disabled }
  }

  return {
    touchableOpacity: palette,
    ...theme,
    ...theme.primary,
    ...palette
  }
}

export default TouchableOpacity
