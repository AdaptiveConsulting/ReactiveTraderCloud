import StatusBar from "@/App/Footer/StatusBar"
import { StatusButton } from "@/App/Footer/StatusButton"
import { SnapshotButton } from "../Snapshots/SnapshotButton"
import { Controls } from "./WindowFooter.styles"
import { OpenFinLogo } from "../Footer/OpenFinLogo"
import ContactUsButton from "../Footer/ContactUsButton"

export const WindowFooter: React.FC = () => (
  <StatusBar>
    <Controls>
      <OpenFinLogo />
      <ContactUsButton />
      <SnapshotButton />
      <StatusButton />
    </Controls>
  </StatusBar>
)
