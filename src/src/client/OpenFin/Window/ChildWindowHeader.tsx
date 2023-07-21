import Header from "@/client/App/Header"

import { Props as ControlsProps, WindowControls } from "./WindowControls"
import { TitleBar } from "./WindowHeader.styles"

interface Props extends ControlsProps {
  title: string
}

const EMPTY = <></>

export const ChildWindowHeader = ({ title, ...controlsProps }: Props) => (
  <Header
    logo={EMPTY}
    controls={<WindowControls {...controlsProps} />}
    filler={<TitleBar>{title}</TitleBar>}
    switches={EMPTY}
  />
)
