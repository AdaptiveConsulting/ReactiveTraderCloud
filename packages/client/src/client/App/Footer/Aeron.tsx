import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { AeronLogo } from "@/client/components/logos/AeronLogo"
import { Typography } from "@/client/components/Typography"
import { AERON } from "@/client/constants"

const AeronLogoWrapper = styled(FlexBox)`
  margin-right: auto;
  align-items: flex-start;
  gap: ${({ theme }) => theme.newTheme.spacing.xs};
  cursor: pointer;
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-primary (900)"]};
  }
`

export const Aeron = () => (
  <AeronLogoWrapper onClick={() => window.open(AERON)}>
    <Typography
      variant="Text xs/Regular"
      color="Colors/Text/text-quaternary (500)"
    >
      Powered by
    </Typography>
    {AeronLogo}
  </AeronLogoWrapper>
)
