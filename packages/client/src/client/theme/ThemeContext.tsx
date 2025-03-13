import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { BehaviorSubject, map } from "rxjs"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { ThemeName, themes } from "./themes"

interface Props {
  storage?: typeof localStorage | typeof sessionStorage
  children: ReactNode
}

interface ContextValue {
  themeName: ThemeName
  setThemeName: Dispatch<SetStateAction<ThemeName>>
}

export const ThemeContext = createContext<ContextValue>({
  themeName: ThemeName.Dark,
  setThemeName: () => console.warn("Missing StorageThemeProvider"),
})

const STORAGE_KEY = "themeName"

const themeName$ = new BehaviorSubject<ThemeName>(ThemeName.Dark)

export const ThemeProvider = ({ storage = localStorage, children }: Props) => {
  const [themeName, setThemeName] = useState<ThemeName>(
    () => (storage.getItem(STORAGE_KEY) as ThemeName) || ThemeName.Dark,
  )

  useEffect(() => {
    const setThemeFromStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const themeName = storage.getItem(STORAGE_KEY) as ThemeName

        if (themeName && themes[themeName] != null) {
          setThemeName(themeName)
          themeName$.next(themeName)
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
    head &&
      head.setAttribute(
        "content",
        themes[themeName].color["Colors/Background/bg-primary"],
      )
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

export const theme$ = themeName$.pipe(map((themeName) => themes[themeName]))

export const ThemeConsumer = ThemeContext.Consumer
