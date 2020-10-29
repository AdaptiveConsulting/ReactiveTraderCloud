import React, { FC } from 'react'
import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  color: ${props => props.theme.textColor};
  opacity: 0.59;
  font-size: 0.75rem;
`
export const Link = styled.a`
  color: inherit;
  text-decoration: inherit;
`
const FooterVersion: FC = () => (
  <Wrapper>
    <Link
      href={
        'https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/' +
        process.env.REACT_APP_ENV
      }
    >
      {process.env.REACT_APP_ENV}
    </Link>
  </Wrapper>
)

export default FooterVersion
