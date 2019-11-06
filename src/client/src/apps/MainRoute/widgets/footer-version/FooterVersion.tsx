import React, { FC } from 'react'
import { styled } from 'rt-theme'

export const Wrapper = styled.div`
  color: ${props => props.theme.textColor};
  opacity: 0.59;
  font-size: 0.75rem;
`

const FooterVersion: FC = () => <Wrapper>v{process.env.REACT_APP_BUILD_VERSION}</Wrapper>

export default FooterVersion
