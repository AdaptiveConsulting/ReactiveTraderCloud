import Header from "@/App/Header"
import ThemeSwitcher from "@/App/Header/theme-switcher"
import { LayoutLock } from "./LayoutLock"
import { Props as WindowControlProps, WindowControls } from "./WindowControls"
import { TitleBar } from "./WindowHeader.styles"
import LoginControls from "@/App/Header/LoginControls"

interface Props extends WindowControlProps {
  title: string
}

export const WindowHeader: React.FC<Props> = ({ title, ...controlsProps }) => (
  <Header
    controls={
      <>
        <LoginControls />
        <WindowControls {...controlsProps} />
      </>
    }
    filler={<TitleBar>{title}</TitleBar>}
    switches={
      <>
        <LayoutLock />
        <ThemeSwitcher />
      </>
    }
  />
)
