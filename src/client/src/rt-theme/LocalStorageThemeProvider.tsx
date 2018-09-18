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
    this.setThemeFromStorage()
    window.addEventListener('storage', this.setThemeFromStorage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('storage', this.setThemeFromStorage)
  }

  getStorageThemeName = () => localStorage.getItem(THEME_STORAGE_KEY)

  setStorageThemeName = (name: ThemeName) => localStorage.setItem(THEME_STORAGE_KEY, name)

  setThemeFromStorage = () => {
    const themeName = this.getStorageThemeName()
    if (themeName) {
      this.setTheme(themeName)
    } else {
      this.setStorageThemeName(this.state.themeName)
    }
  }

  setTheme = (themeName: string) => {
    if (this.isValidThemeUpdate(themeName)) {
      this.setState({ themeName }, () => localStorage.setItem(THEME_STORAGE_KEY, themeName))
    }
  }

  isValidThemeUpdate = (themeName: string): themeName is ThemeName =>
    themeName !== this.state.themeName && (themeName === ThemeName.LIGHT || themeName === ThemeName.DARK)

  render() {
    return (
      <ThemeState.Provider name={this.state.themeName} onChange={this.setTheme}>
        {this.props.children}
      </ThemeState.Provider>
    )
  }
}
