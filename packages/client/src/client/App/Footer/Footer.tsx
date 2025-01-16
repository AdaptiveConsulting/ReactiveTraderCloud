import { Suspense } from "react"
import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { AeronLogo } from "@/client/components/icons/AeronLogo"
import { Typography } from "@/client/components/Typography"
import { AERON } from "@/client/constants"

import ContactUsButton from "./ContactUsButton"
import { Stats } from "./Stats"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

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

export const Footer = () => (
  <StatusBar>
    <AeronLogoWrapper onClick={() => window.open(AERON)}>
      <Typography
        variant="Text xs/Regular"
        color="Colors/Text/text-quaternary (500)"
      >
        Powered by
      </Typography>
      <AeronLogo height={10} />
    </AeronLogoWrapper>
    <Suspense fallback={null}>
      <Stats />
    </Suspense>
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
