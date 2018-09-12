import mapp from '@evanrs/map-props'
import _ from 'lodash'

import { css, resolvesColor, Selector, styled } from 'rt-theme'

import { mapMarginPaddingProps, MarginPaddingProps } from './rules'
import { mapTextProps, TextProps } from './Text'

export interface BlockProps extends TextProps, MarginPaddingProps {
  backgroundColor?: Selector
  textColor?: Selector
  width?: 'auto' | 'min' | 'max'
}

export const Block = styled.div<BlockProps>`
  transition: background-color ease-out 0.15s;

  ${props =>
    css({
      backgroundColor: props.backgroundColor
        ? resolvesColor(props.backgroundColor)(props)
        : resolvesColor('backgroundColor')(props)
    })}

  ${props =>
    css({
      color: props.textColor ? resolvesColor(props.textColor)(props) : resolvesColor('textColor')(props)
    })}
  
  ${mapp({
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
    }
  })};

  ${mapTextProps}
  ${mapMarginPaddingProps};
`

export default Block
