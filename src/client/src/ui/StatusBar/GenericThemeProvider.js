import _ from 'lodash'
import React, { Component } from 'react'
import { ThemeProvider } from 'emotion-theming'

class GenericThemeProvider extends Component {
  resolveTheme = theme => {
    const { type, mode, state } = this.props
    const typeTheme = theme[type]
    const modeTheme = theme[type] && theme[type][mode]
    const stateTheme = theme[type] && theme[type][mode] && theme[type][mode][state]

    return {
      ...theme,
      ...typeTheme,
      ...modeTheme,
      ...stateTheme,
    }
  }

  render() {
    const { type, mode } = this.props

    return <ThemeProvider key={type + mode} theme={this.resolveTheme} />
  }
}
