import _ from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { styled, css, ThemeProvider } from 'rt-theme'
import { mapProps, mapTheme } from '@evanrs/map-props'

import { colors } from 'rt-theme'

import { mapMarginPaddingProps } from './rules'

import { Fill } from './Flex'
import { Block } from './Block'

const mapPalette = ({ palette: key, invert, color }) => {
  return theme => {
    let palette = _.isObject(key) ? key : theme.palettes[key]

    if (color) {
      palette = { ...palette, color: colors[color] || palette.color }
    }

    if (invert && palette.inverted) {
      palette = palette.inverted
    }

    return {
      ...palette,
      palette
    }
  }
}

export class ColorBlock extends PureComponent {
  render() {
    let { palette, invert, color, ...props } = this.props
    if (palette == null) {
      return <ColoredBlock {...props} />
    }

    return (
      <ThemeProvider theme={mapPalette({ palette, invert, color })}>
        <ColoredBlock {...props} />
      </ThemeProvider>
    )
  }
}

export const ThemedBlock = ({ palette, invert, color, ...props }) => {
  if (palette == null) {
    return <Block {...props} />
  }

  return (
    <ThemeProvider theme={mapPalette({ palette, invert, color })}>
      <Block palette={palette} {...props} />
    </ThemeProvider>
  )
}

export const Palette = ({ palette, invert, color, ...props }) => {
  if (palette == null) {
    return <Block {...props} />
  }

  return <ThemeProvider theme={mapPalette({ palette, invert, color })} {...props} />
}

export const ColoredBlock = styled(Block)`
  ${mapTheme({
    palette({ backgroundColor, textColor }, prop, { gradient, transparent, invert, theme }) {
      if (invert) {
        ;[backgroundColor, textColor] = [textColor, backgroundColor]
      }

      return css`


        background-color: ${backgroundColor};
        ${gradient &&
          css`
            background-image: linear-gradient(180deg, ${gradient.join(', ')});
          `}
        color: ${textColor};`
    }
  })};

  ${mapProps({
    transparent: {
      [true]: css`
        background-color: ${colors.transparent};
      `,
      default(color, key, { theme }) {
        color = theme[color] || theme.colors[color]
        if (color) {
          return css`
            background-color: ${color};
          `
        }
      }
    }
  })};
`

export const ColoredFill = ColoredBlock.withComponent(Fill)

export default ColorBlock
