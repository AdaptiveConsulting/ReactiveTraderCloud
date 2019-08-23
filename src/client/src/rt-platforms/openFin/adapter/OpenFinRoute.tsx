import React, { FC } from 'react'
import { OpenFinChrome, OpenFinControls } from 'rt-components'
import { usePlatform } from 'rt-components'

const useHeader = () => {
  const { window } = usePlatform()
  return (
    <OpenFinControls minimize={window.minimize} maximize={window.maximize} close={window.close} />
  )
}

export const OpenFinRoute: FC = ({ children }) => {
  return (
    <OpenFinChrome>
      {React.cloneElement(children as React.ReactElement, { header: useHeader() })}
    </OpenFinChrome>
  )
}

export default OpenFinRoute
