import ContactUsButton from './ContactUsButton'
import StatusBar from './StatusBar'
import { StatusButton } from './StatusButton/StatusButton'

export const Footer: React.FC = () => (
  <StatusBar>
    <ContactUsButton />
    <StatusButton />
  </StatusBar>
)
