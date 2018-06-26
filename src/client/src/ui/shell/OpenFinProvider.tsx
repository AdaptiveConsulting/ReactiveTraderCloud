import * as React from 'react'
import { OpenFin } from '../../services'
import { Environment, withEnvironment } from './EnvironmentProvider'
import OpenFinChrome from './OpenFinChrome'

interface OpenFinShellProps {
  openFin: OpenFin
  environment: Environment
}

const OpenFinMainWindow: React.SFC<OpenFinShellProps> = ({ openFin, environment, children }) =>
  environment.isRunningDesktop ? (
    <OpenFinChrome
      openFin={openFin}
      minimize={openFin.minimize.bind(openFin)}
      maximize={openFin.maximize.bind(openFin)}
      close={openFin.close.bind(openFin)}
    >
      {children}
    </OpenFinChrome>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  )

export default withEnvironment(OpenFinMainWindow)
