import { Typography } from "@/client/components/Typography"
import { ConnectionStatus, useConnectionStatus } from "@/services/connection"

import { Root } from "../common-styles"
import { StatusCircle } from "./styled"

export const StatusButtonInner = ({ status }: { status: ConnectionStatus }) => {
  const appStatus =
    status === ConnectionStatus.IDLE_DISCONNECTED ||
    status === ConnectionStatus.OFFLINE_DISCONNECTED
      ? ConnectionStatus.DISCONNECTED
      : status

  return (
    <Root>
      <StatusCircle status={appStatus} />
      <Typography variant="Text sm/Regular" paddingTop="xs">
        {appStatus[0].toUpperCase() + appStatus.slice(1).toLowerCase()}
      </Typography>
    </Root>
  )
}

export const StatusButton = () => (
  <StatusButtonInner status={useConnectionStatus()} />
)
