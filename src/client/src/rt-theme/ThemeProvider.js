import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider as StyledThemeProvider } from 'emotion-theming'
import { isEqual } from 'lodash'

const ThemeContext = React.createContext()

/**
 * This ThemeProvider adds support for effecient inline theming
 * while also retaining access to the parent theme.
 *
 * <ThemeProvider
 *  theme={(theme) => ({
 *    someColor: theme.colors[this.props.someValue ? 'green' : 'red']}
 *  })}
 * />
 *
 * styled.div`
 *  // We receive the new theme values
 *  color: ${({ theme }) => theme.someColor};
 *
 *  // We also retain access to the parent theme
 *  border-color: ${({ theme }) => theme.red};
 * `
 */
export default class ThemeProvider extends React.Component {
  render() {
    return (
      // We provide and consume theme information from our own ThemeContext
      <ThemeContext.Consumer children={this.renderResolver} />
    )
  }

  renderResolver = theme => (
    // We combine the parent theme with the resolved the child theme
    <ThemeResolver {...this.props} {...{ parentTheme: theme }} children={this.renderProvider} />
  )

  renderProvider = theme => {
    const { children } = this.props

    return (
      // We provide the theme to our ThemeContext for future children
      <ThemeContext.Provider value={theme}>
        {
          // Finally, we must provide the theme to the styled component ThemeProvider
          // Our theme value is guaranteed to remain stable across renders unless
          // the values of the resolve theme changes
          <StyledThemeProvider theme={theme} children={children} />
        }
      </ThemeContext.Provider>
    )
  }
}

class ThemeResolver extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    parentTheme: PropTypes.object
  }

  static getDerivedStateFromProps({ theme, parentTheme }, state) {
    if (typeof theme === 'function') {
      theme = theme(parentTheme)
    }

    return theme === state.theme ||
      // This can be greatly optimized
      isEqual(theme, state.theme)
      ? null
      : {
          theme: {
            // TODO explore how to protect values
            ...parentTheme,
            ...theme
          }
        }
  }

  state = {
    theme: this.props.parentTheme
  }

  render() {
    return this.props.children(this.state.theme)
  }
}
