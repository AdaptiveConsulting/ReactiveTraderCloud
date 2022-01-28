import kebabCase from "lodash/fp/kebabCase"
import styled from "styled-components"
import {
  mapMarginPaddingProps,
  mapTextProps,
  MarginPaddingProps,
  TextProps,
} from "./styled"
export { Paragraph } from "./styled"

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

export const H1 = styled(Header)`
  line-height: 2.5rem;
  font-size: 2.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.9px;
  margin: 0;
`

export const H2 = styled(Header)`
  line-height: 2rem;
  font-size: 1.5rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: -0.66px;
`
export const H3 = styled(Header)`
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: -0.49px;
`

export const H5 = styled.h5`
  line-height: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.38px;
`

export const Code = styled.code`
  display: block;
  font-size: 0.8rem;
  margin: 1rem 0;
`

export const Column = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-flow: column wrap;
  width: 100%;
  height: max-content;
  min-height: 100%;
  overflow: visible;
`

export const NumberedLayout = styled(({ number: n, children, ...props }) => (
  <div {...props}>
    <SectionNumber>{n}</SectionNumber>
    <div>{children}</div>
  </div>
))<{ number: number | string }>`
  display: grid;
  grid-template-columns: 5rem 1fr;
`

export const SectionNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  min-height: 3.5rem;
  max-height: 3.5rem;
  min-width: 3.5rem;
  max-width: 3.5rem;

  font-size: 1.5rem;

  color: ${({ theme }) => theme.secondary[2]};
  box-shadow: 0 0 0 0.125rem ${({ theme }) => theme.secondary[2]};
`

export const Caption = styled.div`
  display: block;
  font-size: 0.6rem;
  line-height: normal;
  margin: 0;
  color: ${({ theme }) => theme.primary[2]};
`
