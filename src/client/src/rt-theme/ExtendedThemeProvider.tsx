import { ThemeProvider as StyledThemeProvider } from 'emotion-theming'
import { isEqual } from 'lodash'
import React, { ComponentClass } from 'react'

type UnknownTheme = object
type ThemeFunctor<T> = (theme: T) => UnknownTheme

export interface ExtendedThemeProviderProps<T = UnknownTheme> {
  theme?: UnknownTheme | ThemeFunctor<T>
}

export type ExtendedThemeContext<T> = React.Context<T>
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

  renderResolver = (theme: UnknownTheme) => (
    // We combine the parent theme with the resolved the child theme
    <ExtendTheme {...this.props} {...{ parentTheme: theme }} children={this.renderProvider} />
  )

  renderProvider = (theme: UnknownTheme) => {
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

interface ExtendThemeProps extends ExtendedThemeProviderProps<UnknownTheme> {
  parentTheme: UnknownTheme
  children: (theme: UnknownTheme) => React.ReactNode
}

interface ExtendThemeState {
  theme: UnknownTheme
}

class ExtendTheme extends React.Component<ExtendThemeProps, ExtendThemeState> {
  static getDerivedStateFromProps({ theme, parentTheme }: ExtendThemeProps, state: ExtendThemeState) {
    if (typeof theme === 'function') {
      theme = (theme as ThemeFunctor<UnknownTheme>)(parentTheme)
    }

    return theme === state.theme ||
      // This can be greatly optimized
      isEqual(theme, state.theme)
      ? null
      : {
          theme: {
            // TODO (8/14/18) explore how to protect values
            ...parentTheme,
            ...theme,
          },
        }
  }

  state = {
    theme: this.props.parentTheme,
  }

  render() {
    return this.props.children(this.state.theme)
  }
}

export const Provider = ExtendedThemeProvider
export const Consumer = ThemeContext.Consumer

export default {
  Provider,
  Consumer,
}
