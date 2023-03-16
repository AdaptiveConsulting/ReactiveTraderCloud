import StatusBar from "@/App/Footer/StatusBar"
import { StatusButton } from "@/App/Footer/StatusButton"
import { Version } from "@/App/Footer/Version"

import ContactUsButton from "../Footer/ContactUsButton"
import { OpenFinLogo } from "../Footer/OpenFinLogo"
import { SnapshotButton } from "../Snapshots/SnapshotButton"
import { isReactiveTraderPlatformPrimary } from "../utils/window"
import { Controls } from "./WindowFooter.styles"

export const WindowFooter = () => {
  const showSnapshots = isReactiveTraderPlatformPrimary()
  return (
    <StatusBar>
      <Controls>
        <Version />
        <OpenFinLogo />
        <ContactUsButton />
        {showSnapshots && <SnapshotButton />}
        <StatusButton />
      </Controls>
    </StatusBar>
  )
}
