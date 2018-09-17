import React from 'react'
import { Helmet } from 'react-helmet'
import { css } from 'rt-theme'
import { ThemeProvider } from './ThemeProvider'
import { Theme, themes } from './themes'

export enum ThemeName {
  LIGHT = 'light',
  DARK = 'dark'
}

interface ThemeSelector {
  name: ThemeName
  /**
   * An unused property — this parallel approach would support
   * custom branding on child components — assuming they
   * subscribe to the struture of our Theme type
   *
   * @evanrs (8/14/18)
   */
  theme?: Theme
}

interface ThemeStateProps extends ThemeSelector {
  onChange?: (value: string) => void
}

export interface ThemeContext extends Partial<ThemeSelector> {
  setTheme?: (options: ThemeSelector) => void
}

const { Provider: ContextProvider, Consumer: ContextConsumer } = React.createContext<ThemeContext>({})

/**
 * Set default theme and allow descendants to update selected theme.
 *
 * @example
 *  <ThemeState name={light | dark} onChange={this.handleThemeChange} />
 */
class ThemeStateProvider extends React.Component<ThemeStateProps> {
  render() {
    return <ContextConsumer children={this.renderThemeStateManager} />
  }

  renderThemeStateManager = (context: ThemeContext) => {
    const { children, name } = this.props
    const theme = themes[name!]

    return (
      <ContextProvider value={{ name, setTheme: this.setTheme }}>
        {context && context.name === name ? (
          children
        ) : (
          <ThemeProvider theme={theme}>
            <React.Fragment>
              {children}
              {// TODO (8/17/18) move to ThemeProvider?
              // Set the background color and color
              context ? null : (
                <Helmet>
                  <html
                    className={css`
                      :root,
                      body {
                        background-color: ${theme.shell.backgroundColor};
                        color: ${theme.shell.textColor};
                      }
                    `}
                  />
                </Helmet>
              )}
            </React.Fragment>
          </ThemeProvider>
        )}
      </ContextProvider>
    )
  }

  setTheme = ({ name }: ThemeSelector) => name && this.props.onChange && this.props.onChange(name)
}

export const Provider = ThemeStateProvider
// TODO (8/14/18) extend ContextConsumer to guard for use without provider
export const Consumer: React.Consumer<ThemeContext> = ContextConsumer

export const ThemeState = {
  Provider,
  Consumer
}

export default ThemeState
