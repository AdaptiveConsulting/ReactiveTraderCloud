import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"

import { Props as ControlsProps, WindowControls } from "./WindowControls"
import { TitleBar } from "./WindowHeader.styles"

interface Props extends ControlsProps {
  title: string
}

export const ChildWindowHeader = ({ title, ...controlsProps }: Props) => (
  <Stack>
    <TitleBar>
      <Typography variant="Text md/Regular">{title}</Typography>
    </TitleBar>
    <WindowControls {...controlsProps} />
  </Stack>
)
