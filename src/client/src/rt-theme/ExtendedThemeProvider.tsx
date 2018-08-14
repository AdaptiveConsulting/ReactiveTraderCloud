import { ThemeProvider as StyledThemeProvider } from 'emotion-theming'
import { isEqual } from 'lodash'
import React, { ComponentClass } from 'react'

type Theme = object

export interface ExtendedThemeProviderProps<T = Theme> {
  theme?: Theme | ((theme: T) => Theme)
}

export type ExtendedThemeProviderClass<T> = ComponentClass<ExtendedThemeProviderProps<T>>

/**
 * Our internal context to communicate theme changes
 */
const ThemeContext = React.createContext<any>({})

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
export class ExtendedThemeProvider extends React.Component<ExtendedThemeProviderProps> {
  render() {
    return (
      // We provide and consume theme information from our own ThemeContext
      <ThemeContext.Consumer children={this.renderResolver} />
    )
  }

  renderResolver = (theme: Theme) => (
    // We combine the parent theme with the resolved the child theme
    <ExtendTheme {...this.props} {...{ parentTheme: theme }} children={this.renderProvider} />
  )

  renderProvider = (theme: Theme) => {
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

interface ExtendThemeProps extends ExtendedThemeProviderProps<Theme> {
  parentTheme: Theme
  children: (theme: Theme) => React.ReactNode
}

interface ExtendThemeState {
  theme: Theme
}

class ExtendTheme extends React.Component<ExtendThemeProps, ExtendThemeState> {
  static getDerivedStateFromProps({ theme, parentTheme }: ExtendThemeProps, state: ExtendThemeState) {
    if (typeof theme === 'function') {
      theme = theme(parentTheme)
    }

    return theme === state.theme ||
      // This can be greatly optimized
      isEqual(theme, state.theme)
      ? null
      : {
          theme: {
            // TODO (8/14/18) explore how to protect values
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

export default ExtendedThemeProvider
