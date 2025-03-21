import Header from "@/client/App/Header"
import LoginControls from "@/client/App/Header/LoginControls"
import ThemeSwitcher from "@/client/App/Header/theme-switcher"
import { Typography } from "@/client/components/Typography"

import { LayoutLock } from "./LayoutLock"
import { Props as WindowControlProps, WindowControls } from "./WindowControls"
import { TitleBar } from "./WindowHeader.styles"

interface Props extends WindowControlProps {
  title: string
}

export const WindowHeader = ({ title, ...controlsProps }: Props) => (
  <Header
    controls={
      <>
        <LoginControls />
        <WindowControls {...controlsProps} />
      </>
    }
    filler={
      <TitleBar>
        <Typography variant="Text md/Regular" textTransform="uppercase">
          {title}
        </Typography>
      </TitleBar>
    }
    switches={
      <>
        <LayoutLock />
        <ThemeSwitcher />
      </>
    }
  />
)
