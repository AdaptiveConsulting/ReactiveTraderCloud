import React, { FC } from 'react'
import { Fill, Header, Root } from './styled'
import { usePlatform } from 'rt-platforms'

const LogoWithPlatform = () => {
  const { Logo } = usePlatform()
  return <Logo />
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
