import { Meta } from "@storybook/react"
import { ThemeName } from "client/theme"
import { ThemeContext } from "client/theme/ThemeContext"

import ThemeSwitcher from "./ThemeSwitcher"

export default {
  title: "Header/ThemeSwitcher",
  component: ThemeSwitcher,
} as Meta<typeof ThemeSwitcher>

export const Dark = {
  render: () => (
    <ThemeContext.Provider
      value={{
        setThemeName: (t) => console.log("Set theme", t),
        themeName: ThemeName.Dark,
      }}
    >
      <ThemeSwitcher />
    </ThemeContext.Provider>
  ),
}
export const Light = {
  render: () => (
    <ThemeContext.Provider
      value={{
        setThemeName: (t) => console.log("Set theme", t),
        themeName: ThemeName.Light,
      }}
    >
      <ThemeSwitcher />
    </ThemeContext.Provider>
  ),
}
