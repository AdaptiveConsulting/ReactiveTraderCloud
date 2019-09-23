import React from 'react'
import { OpenFinLogoLink } from './styled'
import { OpenFinLogo } from './assets/OpenFinLogo'
import { OpenFinBrowserLink } from '../components'

export default () => {
  return (
    <div>
      <OpenFinLogoLink
        href="http://www.openfin.co"
        as={OpenFinBrowserLink}
        data-qa="logo__openfin-logo-link"
      >
        <OpenFinLogo />
      </OpenFinLogoLink>
    </div>
  )
}
