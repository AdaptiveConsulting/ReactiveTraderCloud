import React from 'react'
import { OpenFinLogoLink } from './styled'
import { OpenFinLogo } from './assets/OpenFinLogo'
import { OpenFinBrowserLink } from '../components'
import { styled } from 'rt-theme'

export default () => {
  const Logo = styled.div`
    margin-right: 0.75rem;
  `

  return (
    <Logo>
      <OpenFinLogoLink
        href="http://www.openfin.co"
        as={OpenFinBrowserLink}
        data-qa="logo__openfin-logo-link"
      >
        <OpenFinLogo />
      </OpenFinLogoLink>
    </Logo>
  )
}
