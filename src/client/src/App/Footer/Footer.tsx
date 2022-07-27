import ContactUsButton from "./ContactUsButton"
import { Stats } from "./Stats"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

export const Footer: React.FC = () => (
  <StatusBar>
    <Stats />
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
