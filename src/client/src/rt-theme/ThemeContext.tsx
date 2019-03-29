import React, { useContext } from 'react'
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
  themeName: ThemeName
}

interface ContextValue {
  themeName?: string
  setTheme: (selector: { themeName: ThemeName }) => void
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
    themeName: ThemeName.Dark,
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
      const themeName = storage.getItem(STORAGE_KEY) as ThemeName

      if (themeName && themes[themeName] != null) {
        this.setTheme({ themeName })
      }
    }
  }

  setTheme = ({ themeName }: State) => {
    if (themeName !== this.state.themeName) {
      this.setState({ themeName }, () => this.props.storage.setItem(STORAGE_KEY, themeName))
    }
  }

  render() {
    return (
      <ThemeContext.Provider value={{ themeName: this.state.themeName, setTheme: this.setTheme }}>
        <StyledThemeProvider theme={themes[this.state.themeName]}>
          <>{this.props.children}</>
        </StyledThemeProvider>
      </ThemeContext.Provider>
    )
  }
}

export const useTheme = () => {
  const { themeName, setTheme } = useContext(ThemeContext)
  const toggleTheme = () =>
    setTheme({
      themeName: themeName === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark,
    })
  return { themeName, setTheme, toggleTheme }
}

export const ThemeProvider = ThemeStorageProvider
export const ThemeConsumer = ThemeContext.Consumer
