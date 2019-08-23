import React, { FC } from 'react'
import { OpenFinChrome, OpenFinControls } from 'rt-components'
import { usePlatform } from 'rt-components'

const platform = usePlatform()

const header = (
  <OpenFinControls
    minimize={platform.window.minimize}
    maximize={platform.window.maximize}
    close={platform.window.close}
  />
)

export const OpenFinRoute: FC = ({ children }) => {
  return <OpenFinChrome>{React.cloneElement(children[0], { header })}</OpenFinChrome>
}

export default OpenFinRoute
