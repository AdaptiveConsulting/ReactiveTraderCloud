import * as PropTypes from 'prop-types'
import * as React from 'react'
import OpenFinChrome from './OpenFinChrome'

export interface ChildContextTypes {
  getChildContext?: () => boolean
  openFin: any
  isRunningInFinsemble: boolean
}

export default class OpenFinProvider extends React.Component<
  ChildContextTypes,
  {}
> {
  props
  static childContextTypes = {
    openFin: PropTypes.object
  }

  getChildContext() {
    const { openFin } = this.props

    return { openFin: openFin.isRunningInOpenFin ? openFin : null }
  }

  render() {
    const { openFin, isRunningInFinsemble } = this.props

    // display the window chrome in the OpenFin environment, but disable if Finsemble is detected (it has a wrapper with own chrome
    return openFin.isRunningInOpenFin && !isRunningInFinsemble ? (
      <OpenFinChrome
        openFin={openFin}
        minimize={openFin.minimize.bind(openFin)}
        maximize={openFin.maximize.bind(openFin)}
        close={openFin.close.bind(openFin)}
      >
        {this.props.children}
      </OpenFinChrome>
    ) : (
      React.Children.only(this.props.children)
    )
  }
}
