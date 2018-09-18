import React from 'react'
import { ThemeProvider, themes } from 'rt-theme'

export enum ThemeName {
  Light = 'light',
  Dark = 'dark',
}

interface Props {
  default: ThemeName
  storage: typeof localStorage | typeof sessionStorage
  storageKey: string
}

interface State {
  name: ThemeName
}

interface ContextValue {
  name?: string
  setTheme: (selector: { name: ThemeName }) => void
}

const Context = React.createContext<ContextValue>({
  setTheme: () => console.warn('Missing StorageThemeProvider'),
})

class ThemeStorageProvider extends React.Component<Props, State> {
  static defaultProps = {
    default: ThemeName.Light,
    storage: localStorage,
    storageKey: 'themeName',
  }

  state = {
    name: this.props.default,
  }

  componentDidMount = () => {
    this.setThemeFromStorage()
    window.addEventListener('storage', this.setThemeFromStorage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('storage', this.setThemeFromStorage)
  }

  setThemeFromStorage = (event?: StorageEvent) => {
    const { storage, storageKey } = this.props

    if (event == null || event.key === storageKey) {
      const name = storage.getItem(storageKey) as ThemeName

      if (name && themes[name] != null) {
        this.setTheme({ name })
      }
    }
  }

  setTheme = ({ name }: State) => {
    if (name !== this.state.name) {
      this.setState({ name }, () => this.props.storage.setItem(this.props.storageKey, name))
    }
  }

  render() {
    return (
      <Context.Provider value={{ name: this.state.name, setTheme: this.setTheme }}>
        <ThemeProvider theme={themes[this.state.name]}>{this.props.children}</ThemeProvider>
      </Context.Provider>
    )
  }
}

export const ThemeStorage = {
  Provider: ThemeStorageProvider,
  Consumer: Context.Consumer,
}

export default ThemeStorage
