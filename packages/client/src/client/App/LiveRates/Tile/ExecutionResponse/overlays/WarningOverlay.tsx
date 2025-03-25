import { WarningIcon } from "@/client/components/icons"
import WarningIconSvg from "@/client/components/icons/svg/warningIcon.svg"
import { Typography } from "@/client/components/Typography"

import { OverlayBackgroundImage, OverlayBase } from "./components"

export const WarningOverlay = (props: { base: string; terms: string }) => (
  <OverlayBase
    backgroundColor="Colors/Background/bg-warning-primary"
    color="Colors/Foreground/fg-warning-primary"
    Icon={<WarningIcon height={16} width={16} />}
    {...props}
  >
    <OverlayBackgroundImage
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      paddingX="4xl"
      url={WarningIconSvg}
    >
      <Typography
        variant="Text md/Bold"
        color="Colors/Text/text-primary (900)"
        role="alert"
      >
        Trade execution taking longer than expected.
      </Typography>
    </OverlayBackgroundImage>
  </OverlayBase>
)
