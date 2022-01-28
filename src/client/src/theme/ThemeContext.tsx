import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import { themes } from "./themes"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

export enum ThemeName {
  Light = "light",
  Dark = "dark",
}

interface Props {
  storage?: typeof localStorage | typeof sessionStorage
}

interface ContextValue {
  themeName?: string
  setThemeName: Dispatch<SetStateAction<ThemeName>>
}

export const ThemeContext = createContext<ContextValue>({
  setThemeName: () => console.warn("Missing StorageThemeProvider"),
})

const STORAGE_KEY = "themeName"

export const ThemeProvider: React.FC<Props> = ({
  storage = localStorage,
  children,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(
    () => (storage.getItem(STORAGE_KEY) as ThemeName) || ThemeName.Dark,
  )

  useEffect(() => {
    const setThemeFromStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const themeName = storage.getItem(STORAGE_KEY) as ThemeName

        if (themeName && themes[themeName] != null) {
          setThemeName(themeName)
        }
      }
    }

    window.addEventListener("storage", setThemeFromStorage)
    return () => {
      window.removeEventListener("storage", setThemeFromStorage)
    }
  }, [storage])

  useEffect(() => {
    storage.setItem(STORAGE_KEY, themeName)
  }, [storage, themeName])

  // set themeColor in index.html (used for PWA title bar)
  useEffect(() => {
    const head = document.getElementById("themeColor")
    head && head.setAttribute("content", themes[themeName].backgroundColor)
  }, [themeName])

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <StyledThemeProvider theme={themes[themeName]}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const { themeName, setThemeName } = useContext(ThemeContext)
  const toggleTheme = () =>
    setThemeName((prevThemeName) =>
      prevThemeName === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark,
    )

  return { themeName, setTheme: setThemeName, toggleTheme }
}

export const ThemeConsumer = ThemeContext.Consumer
