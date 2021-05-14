import Header from "@/App/Header"
import ThemeSwitcher from "@/App/Header/theme-switcher"
import { LayoutLock } from "./LayoutLock"
import { Props as ControlsProps, WindowControls } from "./WindowControls"
import { TitleBar } from "./WindowHeader.styles"

interface Props extends ControlsProps {
  title: string
}

export const WindowHeader: React.FC<Props> = ({ title, ...controlsProps }) => (
  <Header
    controls={<WindowControls {...controlsProps} />}
    filler={<TitleBar>{title}</TitleBar>}
    switches={
      <>
        <LayoutLock />
        <ThemeSwitcher />
      </>
    }
  />
)
