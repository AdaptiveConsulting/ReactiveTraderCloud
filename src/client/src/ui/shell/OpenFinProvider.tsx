import * as React from 'react'
import { EnvironmentConsumer } from '../../main'
import { OpenFin } from '../../services'
import OpenFinChrome from './OpenFinChrome'

interface OpenFinShellProps {
  openFin: OpenFin
}

const OpenFinMainWindow: React.SFC<OpenFinShellProps> = ({ openFin, children }) => (
  <EnvironmentConsumer>
    {isRunningOnDesktop =>
      isRunningOnDesktop ? (
        <OpenFinChrome
          openFin={openFin}
          minimize={openFin.minimize.bind(openFin)}
          maximize={openFin.maximize.bind(openFin)}
          close={openFin.close.bind(openFin)}
        >
          {children}
        </OpenFinChrome>
      ) : (
        children
      )
    }
  </EnvironmentConsumer>
)

export default OpenFinMainWindow
