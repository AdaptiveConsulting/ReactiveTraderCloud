import ContactUsButton from "./ContactUsButton"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"

export const Footer: React.FC = () => (
  <StatusBar>
    <Version />
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
