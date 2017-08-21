import * as React from 'react'

interface childContextTypes {
  getChildContext?: () => boolean
  openFin: any,
}

export default class OpenFinProvider extends React.Component<childContextTypes, {}> {
  static childContextTypes = {
    openFin: React.PropTypes.object,
  }

  getChildContext() {
    return { openFin: this.props.openFin.isRunningInOpenFin ? this.props.openFin : null }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
