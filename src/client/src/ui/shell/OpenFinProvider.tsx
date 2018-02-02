import * as React from 'react'
import OpenFinChrome from './OpenFinChrome'
import * as PropTypes from 'prop-types'

export interface ChildContextTypes {
  getChildContext?: () => boolean
  openFin: any,
}

export default class OpenFinProvider extends React.Component<ChildContextTypes, {}> {
  props
  static childContextTypes = {
    openFin: PropTypes.object
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
