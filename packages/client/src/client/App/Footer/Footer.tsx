import { Suspense } from "react"
import styled from "styled-components"

import { AeronLogo } from "@/client/components/icons/AeronLogo"

import ContactUsButton from "./ContactUsButton"
import { Stats } from "./Stats"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

const AeronLogoWrapper = styled.div`
  margin-right: auto;
`

export const Footer = () => (
  <StatusBar>
    <AeronLogoWrapper>
      <AeronLogo height={14} fill="white" />
    </AeronLogoWrapper>
    <Suspense fallback={null}>
      <Stats />
    </Suspense>
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
