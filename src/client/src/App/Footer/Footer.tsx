import { Subscribe } from "@react-rxjs/core"
import ContactUsButton from "./ContactUsButton"
import { Stats } from "./Stats"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

export const Footer: React.FC = () => (
  <StatusBar>
    <Subscribe>
      <Stats />
    </Subscribe>
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
