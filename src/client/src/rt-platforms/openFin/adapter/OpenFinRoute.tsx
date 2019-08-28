import React, { FC, ReactNode } from 'react'
import { OpenFinChrome, OpenFinHeader } from '../components'
import { usePlatform } from 'rt-components'

type WindowRole = 'main' | 'sub'

interface RouteWrapperProps {
  children?: ReactNode
  windowType?: WindowRole
}

export const OpenFinRoute: FC<RouteWrapperProps> = ({ children, windowType = 'main' }) => {
  const { window } = usePlatform()
  const windowControls =
    windowType === 'main'
      ? {
          close: window.close,
          minimize: window.minimize,
          maximize: window.maximize,
        }
      : {
          close: window.close,
        }

  return (
    <OpenFinChrome>
      <OpenFinHeader {...windowControls} />
      {children}
    </OpenFinChrome>
  )
}

export default OpenFinRoute
