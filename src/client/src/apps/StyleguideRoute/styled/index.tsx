// For inclusion in rt-styleguide package
import * as mMPP from './mapMarginPaddingProps'
import * as block from './Block'
import Block from './Block'
import * as paragraph from './Paragraph'
import * as text from './Text'
export const { Paragraph } = paragraph
export const { mapMarginPaddingProps } = mMPP
export type MarginPaddingProps = mMPP.MarginPaddingProps
export type MarginProps = mMPP.MarginProps
export type PaddingProps = mMPP.PaddingProps

export type BlockProps = block.BlockProps
export { Block }
export const { Text, mapTextProps } = text
export type TextProps = text.TextProps

export type ParagraphProps = paragraph.ParagraphProps

// Back to our regularly scheduled exports
export { SectionBlock, SectionBody } from './SectionBlock'
