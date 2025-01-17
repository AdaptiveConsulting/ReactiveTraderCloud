import { Suspense } from "react"

import { Aeron } from "./Aeron"
import ContactUsButton from "./ContactUsButton"
import { Stats } from "./Stats"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

export const Footer = () => (
  <StatusBar>
    <Aeron />
    <Suspense fallback={null}>
      <Stats />
    </Suspense>
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
