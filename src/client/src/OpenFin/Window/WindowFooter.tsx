import StatusBar from "@/App/Footer/StatusBar"
import { StatusButton } from "@/App/Footer/StatusButton"
import { Version } from "@/App/Footer/Version"

import ContactUsButton from "../Footer/ContactUsButton"
import { OpenFinLogo } from "../Footer/OpenFinLogo"
import { SnapshotButton } from "../Snapshots/SnapshotButton"
import { Controls } from "./WindowFooter.styles"

export const WindowFooter = () => (
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
