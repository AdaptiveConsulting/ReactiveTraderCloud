import { styled, css } from 'rt-theme'
import mapProps from '@evanrs/map-props'

import { resolvesColor } from 'rt-theme/tools'
import { userSelectButton, mapMarginPaddingProps } from '../styled/rules'

import Block from './Block'
import ColorBlock from './ColorBlock'

export const textProps = {
  href: userSelectButton,
  to: userSelectButton,
  onClick: userSelectButton,
  onPress: userSelectButton,
  onTouchTap: userSelectButton,

  align: {
    center: css`
      text-align: center;
    `,
    right: css`
      text-align: right;
    `
  },

  wrap: {
    default: css`
      white-space: normal;
    `,
    normal: css`
      white-space: normal;
    `,
    nowrap: css`
      white-space: nowrap;
    `,
    pre: css`
      white-space: pre-wrap;
    `
  },

  decoration: {
    underline: css`
      text-decoration: underline;
    `
  },

  width: {
    auto: css`
      width: auto;
      max-width: auto;
    `,
    min: css`
      width: min-content;
      min-width: min-content;
      max-width: min-content;
    `,
    max: css`
      width: max-content;
      min-width: max-content;
      max-width: max-content;
    `
  },

  color(color, prop, { theme }) {
    let fallback = color === 'light' ? 'offblack50' : 'textColor'
    let themeColor = resolvesColor(color, fallback)({ theme })

    if (themeColor) {
      return css`
        color: ${themeColor};
      `
    }
  }
}

export const mapTextProps = mapProps(textProps)

export const Text = styled.span`
  ${mapMarginPaddingProps};
  ${mapTextProps};
`

export const TextBlock = styled(ColorBlock)`
  ${mapTextProps};
`

export default Text
