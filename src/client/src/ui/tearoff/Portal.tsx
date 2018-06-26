import * as React from 'react'
import { Environment, withEnvironment } from '../shell/EnvironmentProvider'

const defaultPortalProps = {
  name: '',
  title: '',
  url: '',
  width: 600,
  height: 640,
  center: 'parent' as 'parent' | 'screen',
  onBlock: null as () => void,
  onUnload: null as () => void,
  onDesktop: false
}

export type PortalProps = typeof defaultPortalProps

const PortalSwitcher: React.SFC<Partial<PortalProps> & { environment: Environment }> = portalProps => {
  const PortalManager = portalProps.environment.PortalManager
  return <PortalManager {...portalProps} />
}

export const Portal = withEnvironment(PortalSwitcher)
