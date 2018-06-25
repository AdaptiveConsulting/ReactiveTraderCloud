import * as React from 'react'
import { OpenFin } from '../../services'
import OpenFinChrome from './OpenFinChrome'

interface OpenFinShellProps {
  openFin: OpenFin
}

export default class OpenFinMainWindow extends React.Component<OpenFinShellProps> {
  render() {
    const { openFin } = this.props
    return (
      <OpenFinChrome
        openFin={openFin}
        minimize={openFin.minimize.bind(openFin)}
        maximize={openFin.maximize.bind(openFin)}
        close={openFin.close.bind(openFin)}
      >
        {this.props.children}
      </OpenFinChrome>
    )
  }
}
