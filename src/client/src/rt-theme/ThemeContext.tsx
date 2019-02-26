import React from 'react'
import { themes } from './themes'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

export enum ThemeName {
  Light = 'light',
  Dark = 'dark',
}

interface Props {
  storage: typeof localStorage | typeof sessionStorage
}

interface State {
  name: ThemeName
}

interface ContextValue {
  name?: string
  setTheme: (selector: { name: ThemeName }) => void
}

const ThemeContext = React.createContext<ContextValue>({
  setTheme: () => console.warn('Missing StorageThemeProvider'),
})

const STORAGE_KEY = 'themeName'

class ThemeStorageProvider extends React.Component<Props, State> {
  static defaultProps = {
    storage: localStorage,
  }

  state = {
    name: ThemeName.Dark,
  }

  componentDidMount = () => {
    this.setThemeFromStorage()
    window.addEventListener('storage', this.setThemeFromStorage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('storage', this.setThemeFromStorage)
  }

  setThemeFromStorage = (event?: StorageEvent) => {
    const { storage } = this.props

    if (event == null || event.key === STORAGE_KEY) {
      const name = storage.getItem(STORAGE_KEY) as ThemeName

      if (name && themes[name] != null) {
        this.setTheme({ name })
      }
    }
  }

  setTheme = ({ name }: State) => {
    if (name !== this.state.name) {
      this.setState({ name }, () => this.props.storage.setItem(STORAGE_KEY, name))
    }
  }

  render() {
    return (
      <ThemeContext.Provider value={{ name: this.state.name, setTheme: this.setTheme }}>
        <StyledThemeProvider theme={themes[this.state.name]}>
          <React.Fragment>{this.props.children}</React.Fragment>
        </StyledThemeProvider>
      </ThemeContext.Provider>
    )
  }
}

export const ThemeProvider = ThemeStorageProvider
export const ThemeConsumer = ThemeContext.Consumer
