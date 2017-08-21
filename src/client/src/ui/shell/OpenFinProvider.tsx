import * as React from 'react'
import OpenFinChrome from './OpenFinChrome'

interface childContextTypes {
  getChildContext?: () => boolean
  openFin: any,
}

export default class OpenFinProvider extends React.Component<childContextTypes, {}> {
  static childContextTypes = {
    openFin: React.PropTypes.object,
  }

  getChildContext() {
    const { openFin } = this.props

    return { openFin: openFin.isRunningInOpenFin ? openFin : null }
  }

  render() {
    const { openFin } = this.props

    return openFin.isRunningInOpenFin ? 
      <OpenFinChrome
        openFin={openFin}
        minimize={openFin.minimize.bind(openFin)}
        maximize={openFin.maximize.bind(openFin)}
        close={openFin.close.bind(openFin)}>
        {this.props.children}
      </OpenFinChrome> 
    : React.Children.only(this.props.children)
  }
}
