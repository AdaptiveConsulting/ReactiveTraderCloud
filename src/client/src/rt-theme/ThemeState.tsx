import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import { Theme, themes } from './themes'

type ThemeName = 'light' | 'dark'

interface ThemeSelector {
  name?: ThemeName
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
  onChange?: (value: ThemeSelector) => void
}

interface ThemeStateValue extends ThemeSelector {
  setTheme: (options: ThemeSelector) => void
}

const { Provider: ContextProvider, Consumer: ContextConsumer } = React.createContext(null)

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

  renderThemeStateManager = (context: ThemeStateValue | null) => {
    return <ThemeStateManager context={context} {...this.props} />
  }
}

class ThemeStateManager extends React.Component<ThemeStateProps & { context: ThemeStateValue }, ThemeStateValue> {
  static getDerivedStateFromProps(props, state) {
    const { name, context } = props

    if (context == null && name == null) {
      throw new Error(`
        ThemeState requires [name] <ThemeState.Provider name="light"/>
      `)
    }

    if (state.name == null) {
      return {
        name: name || context.name
      }
    }

    return null
  }

  state = {
    name: null,
    setTheme: ({ name }: ThemeSelector) => {
      this.setState({ name }, () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.name)
        }
      })
    }
  }

  render() {
    const { context, children } = this.props
    const { name } = this.state

    return (
      <ContextProvider value={this.state}>
        {context && context.name === name ? children : <ThemeProvider theme={themes[name]} children={children} />}
      </ContextProvider>
    )
  }
}

export const Provider = ThemeStateProvider
// TODO (8/14/18) extend ContextConsumer to guard for use without provider
export const Consumer: React.Consumer<ThemeStateValue> = ContextConsumer

export const ThemeState = {
  Provider,
  Consumer
}

export default ThemeState
