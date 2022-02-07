import { FC } from "react"
import SwitchO, { ReactSwitchProps } from "react-switch"
import { withTheme } from "styled-components"
import { Theme, ThemeName, useTheme } from "."

// TODO: Get rid of this library or open an issue/PR to fix their build
const Switch: typeof SwitchO = (SwitchO as any).default
  ? (SwitchO as any).default
  : SwitchO

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}

const ThemeStorageSwitch: FC<ThemeStorageSwitchProps & { theme: Theme }> = ({
  theme,
  ...props
}) => {
  const { themeName, toggleTheme } = useTheme()

  return (
    <Switch
      onChange={toggleTheme}
      checked={themeName === ThemeName.Dark}
      checkedIcon={false}
      uncheckedIcon={false}
      height={12}
      width={27}
      handleDiameter={props.handleDiameter}
      offColor={theme.secondary[4]}
      offHandleColor={theme.secondary.base}
      onColor={theme.primary[4]}
      onHandleColor={theme.primary[2]}
      activeBoxShadow={`0 0 0 0.125rem ${theme.secondary[4]} inset`}
      {...props}
    />
  )
}
ThemeStorageSwitch.defaultProps = {
  handleDiameter: 12,
}

export default withTheme(ThemeStorageSwitch)
