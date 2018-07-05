import * as React from 'react'
import { OpenFin } from '../../services'
import OpenFinChrome from './OpenFinChrome'

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
