import Header from "@/App/Header"
import { AdminHeader } from "@/App/Header/AdminHeader"
import LoginControls from "@/App/Header/LoginControls"
import ThemeSwitcher from "@/App/Header/theme-switcher"

import { LayoutLock } from "./LayoutLock"
import { Props as WindowControlProps, WindowControls } from "./WindowControls"
import { TitleBar } from "./WindowHeader.styles"

interface Props extends WindowControlProps {
  title: string
  admin: boolean
}

export const WindowHeader = ({ admin, title, ...controlsProps }: Props) =>
  admin ? (
    <AdminHeader controls={<WindowControls {...controlsProps} />} />
  ) : (
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
