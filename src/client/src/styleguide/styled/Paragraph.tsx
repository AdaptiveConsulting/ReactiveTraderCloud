import styled from 'styled-components'
import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'
import { mapTextProps, TextProps } from './Text'

export interface ParagraphProps extends TextProps, MarginPaddingProps {}

export const Paragraph = styled.p<ParagraphProps>`
  max-width: 60rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: normal;
  margin: 0.5rem 0;

  ${mapTextProps};
  ${mapMarginPaddingProps};
`
