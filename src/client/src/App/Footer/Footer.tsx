import { Suspense } from "react"
import ContactUsButton from "./ContactUsButton"
import { Stats } from "./Stats"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

export const Footer: React.FC = () => (
  <StatusBar>
    <Suspense fallback={null}>
      <Stats />
    </Suspense>
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
