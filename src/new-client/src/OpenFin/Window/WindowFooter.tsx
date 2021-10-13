import StatusBar from "@/App/Footer/StatusBar"
import { StatusButton } from "@/App/Footer/StatusButton"
import { SnapshotButton } from "../Snapshots/SnapshotButton"
import { Controls } from "./WindowFooter.styles"
import { OpenFinLogo } from "../Footer/OpenFinLogo"
import ContactUsButton from "../Footer/ContactUsButton"
import { Version } from "@/App/Footer/Version"

export const WindowFooter: React.FC = () => (
  <StatusBar>
    <Controls>
      <Version />
      <OpenFinLogo />
      <ContactUsButton />
      <SnapshotButton />
      <StatusButton />
    </Controls>
  </StatusBar>
)
