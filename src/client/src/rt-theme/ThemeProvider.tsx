import React from 'react'
import { Helmet } from 'react-helmet'

import { Theme as ThemeType } from 'rt-theme'
import { css } from './emotion'

import ExtendedTheme, { ExtendedThemeProviderProps } from './ExtendedThemeProvider'

export interface ThemeProviderProps extends ExtendedThemeProviderProps<ThemeType> {}

export class ThemeProvider extends React.Component<ThemeProviderProps> {
  render() {
    return (
      // Read from context to determine whether this is the root provider
      <ExtendedTheme.Consumer>
        {(context: ThemeType) => {
          const { children, theme } = this.props

          // Is this theme already provided?
          if (context && context === theme) {
            return children
          }

          return (
            <ExtendedTheme.Provider theme={theme}>
              <React.Fragment>
                {children}
                {context ? null : (
                  // Set root className for the root ThemeProvider
                  <RootThemeInjection theme={theme as ThemeType} />
                )}
              </React.Fragment>
            </ExtendedTheme.Provider>
          )
        }}
      </ExtendedTheme.Consumer>
    )
  }
}

const RootThemeInjection: React.SFC<{ theme: ThemeType }> = ({ theme }) => (
  <Helmet>
    <html
      className={css({
        backgroundColor: theme.shell.backgroundColor,
        color: theme.shell.textColor,
      })}
    />
  </Helmet>
)

export const Provider = ThemeProvider
export const Consumer: React.Consumer<ThemeType> = ExtendedTheme.Consumer
export const ThemeConsumer = Consumer

export const Theme = {
  Provider,
  Consumer,
}

export default Theme
