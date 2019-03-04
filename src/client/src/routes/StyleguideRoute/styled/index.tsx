// For inclusion in rt-styleguide package
import { mapMarginPaddingProps, MarginPaddingProps, MarginProps, PaddingProps } from './mapMarginPaddingProps'
import Block, { BlockProps } from './Block'
import { ColorProps } from './Color'
import { Paragraph, ParagraphProps } from './Paragraph'
import { Text, TextProps, mapTextProps } from './Text'
export { Paragraph }
// export { extendProps, mergeProps } from '../tools'
export { mapMarginPaddingProps }
export type MarginPaddingProps = MarginPaddingProps
export type MarginProps = MarginProps
export type PaddingProps = PaddingProps
export { Block }

export type BlockProps = BlockProps
export type ColorProps = ColorProps
export { Text, mapTextProps }
export type TextProps = TextProps

export type ParagraphProps = ParagraphProps

// Back to our regularly scheduled exports
export { SectionBlock, SectionBody } from './SectionBlock'
