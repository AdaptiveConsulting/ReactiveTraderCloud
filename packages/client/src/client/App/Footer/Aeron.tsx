import styled from "styled-components"

import { AeronLogo } from "@/client/components/logos/AeronLogo"
import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import { AERON } from "@/client/constants"

const AeronLogoWrapper = styled(Stack)`
  margin-right: auto;
  cursor: pointer;
  svg {
    fill: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};
  }
`

export const Aeron = () => (
  <AeronLogoWrapper
    alignItems="flex-start"
    gap="xs"
    onClick={() => window.open(AERON)}
  >
    <Typography
      variant="Text xs/Regular"
      color="Colors/Text/text-quaternary (500)"
    >
      Powered by
    </Typography>
    {AeronLogo}
  </AeronLogoWrapper>
)
