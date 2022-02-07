import { ThemeContext, ThemeName } from "@/theme/ThemeContext"
import { ComponentMeta } from "@storybook/react"
import ThemeSwitcher from "./ThemeSwitcher"

export default {
  title: "Header/ThemeSwitcher",
  component: ThemeSwitcher,
} as ComponentMeta<typeof ThemeSwitcher>

export const Dark = () => (
  <ThemeContext.Provider
    value={{
      setThemeName: (t) => console.log("Set theme", t),
      themeName: ThemeName.Dark,
    }}
  >
    <ThemeSwitcher />
  </ThemeContext.Provider>
)

export const Light = () => (
  <ThemeContext.Provider
    value={{
      setThemeName: (t) => console.log("Set theme", t),
      themeName: ThemeName.Light,
    }}
  >
    <ThemeSwitcher />
  </ThemeContext.Provider>
)
