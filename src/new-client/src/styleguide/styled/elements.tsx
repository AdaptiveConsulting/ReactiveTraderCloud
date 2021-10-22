import { kebabCase } from "lodash"
import styled from "styled-components"

import {
  mapMarginPaddingProps,
  mapTextProps,
  MarginPaddingProps,
  TextProps,
} from "."

export { Paragraph } from "."

const Hashable = ({ is: Element = "div" as any, ...props }) => (
  <Element {...props} id={kebabCase(props.children)} />
)

interface HeaderProps extends MarginPaddingProps, TextProps {}
export const Header = styled(Hashable)<HeaderProps>`
  margin: 1rem 0 1rem;

  min-width: 100%;
  font-weight: 500;
  font-size: 1.5rem;
  letter-spacing: 0;

  ${mapTextProps};
  ${(props) => mapMarginPaddingProps(props)};
`
export const H2 = styled(Header)`
  line-height: 2rem;
  font-size: 1.5rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: -0.66px;
`
