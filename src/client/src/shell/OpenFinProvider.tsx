import * as React from 'react'
import { OpenFinChrome } from 'rt-components'
import { OpenFin } from './openFin'

interface OpenFinShellProps {
  openFin: OpenFin
}

const OpenFinMainWindow: React.SFC<OpenFinShellProps> = ({ openFin, children }) => (
  <OpenFinChrome
    openFin={openFin}
    minimize={openFin.minimize.bind(openFin)}
    maximize={openFin.maximize.bind(openFin)}
    close={openFin.close.bind(openFin)}
  >
    {children}
  </OpenFinChrome>
)

export default OpenFinMainWindow
