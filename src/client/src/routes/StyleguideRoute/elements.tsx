import mapp from '@evanrs/map-props'
import _ from 'lodash'
import React from 'react'
import { css, styled, Styled } from 'rt-theme'

import { resolvesColor } from 'rt-theme'

import { mapMarginPaddingProps, MarginPaddingProps } from './styled'

export { Paragraph } from './styled'

interface HeaderProps extends MarginPaddingProps {
  caps?: boolean
  weight?: number
}

export const Hashable = ({ is: Element = 'div', ...props }) => <Element {...props} id={_.kebabCase(props.children)} />

export const Header: Styled<HeaderProps> = styled(Hashable)`
  margin: 1rem 0 1rem;

  min-width: 100%;
  font-weight: 500;
  font-size: 1.5rem;
  letter-spacing: 0;

  ${mapp({
    caps: css`
      text-transform: uppercase;
      letter-spacing: -0.125em;
    `,

    weight: ({ weight }) =>
      css`
        font-weight: ${weight};
      `
  })};

  ${mapMarginPaddingProps};
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
  overflow: hidden;
`

export const NumberedLayout = styled<{ number: number | string }>(({ number, children, ...props }) => (
  <div {...props}>
    <SectionNumber>{number}</SectionNumber>
    <div>{children}</div>
  </div>
))`
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

  color: ${resolvesColor('secondary[2]')};
  box-shadow: 0 0 0 0.125rem ${resolvesColor('secondary[2]')};
`

// export const headers = {
//   1: {
//     lineHeight: '3rem',
//     fontSize: '2.25rem',
//     fontWeight: 'bold',
//     textTransform: 'uppercase'
//   },
//   2: {
//     lineHeight: '2rem',
//     fontSize: '1.5rem',
//     fontWeight: '300',
//     textTransform: 'uppercase',
//     letterSpacing: '0.125rem'
//   },
//   3: {
//     lineHeight: '1.5rem',
//     fontSize: '1.125rem',
//     fontWeight: '400',
//     letterSpacing: '-0.49px'
//   },
//   4: {},
//   5: {}
// }
