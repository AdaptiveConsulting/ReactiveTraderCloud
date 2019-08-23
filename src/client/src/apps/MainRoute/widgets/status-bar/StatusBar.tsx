import React, { FC } from 'react'
import { Fill, Header, Root, OpenFinLogoLink } from './styled'
import { OpenFinLogo } from './assets/OpenFinLogo'
import { OpenFinBrowserLink, usePlatform } from 'rt-components'

const LogoWithPlatform: FC = () => {
  const platform = usePlatform()
  return (
    <div>
      {platform.name === 'openfin' && (
        <OpenFinLogoLink href="http://www.openfin.co" as={OpenFinBrowserLink}>
          <OpenFinLogo />
        </OpenFinLogoLink>
      )}
    </div>
  )
}
interface Props {
  fillSize?: number
}
const StatusBar: FC<Props> = ({ fillSize = 1, children }) => (
  <Root>
    <Header>
      <Fill size={fillSize} />
      <LogoWithPlatform />
      {children}
    </Header>
  </Root>
)

export default StatusBar
