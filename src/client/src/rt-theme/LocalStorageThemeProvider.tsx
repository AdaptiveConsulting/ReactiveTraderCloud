import React from 'react'
import { ThemeName, ThemeState } from 'rt-theme'

interface State {
  themeName: ThemeName
}

const THEME_STORAGE_KEY = 'themeName'

export default class LocalStorageThemeProvider extends React.Component<{}, State> {
  state = {
    themeName: ThemeName.LIGHT
  }

  componentDidMount = () => {
    this.setThemeNameFromStorage()
    window.addEventListener('storage', this.setThemeNameFromStorage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('storage', this.setThemeNameFromStorage)
  }

  getThemeNameFromStorage = () => localStorage.getItem(THEME_STORAGE_KEY)

  setThemeNameFromStorage = () => {
    const themeName = this.getThemeNameFromStorage()
    if (themeName === ThemeName.LIGHT || themeName === ThemeName.DARK) {
      this.setState({ themeName })
    }
  }

  updateLocalStorageThemeName = (name: string) => {
    localStorage.setItem(THEME_STORAGE_KEY, name)
    this.setThemeNameFromStorage()
  }

  render() {
    return (
      <ThemeState.Provider name={this.state.themeName} onChange={this.updateLocalStorageThemeName}>
        {this.props.children}
      </ThemeState.Provider>
    )
  }
}
