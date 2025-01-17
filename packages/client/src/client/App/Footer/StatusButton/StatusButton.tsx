import { Gap } from "@/client/components/Gap"
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
      <Gap width="xs" />
      <Typography variant="Text sm/Regular">
        {appStatus[0].toUpperCase() + appStatus.slice(1).toLowerCase()}
      </Typography>
    </Root>
  )
}

export const StatusButton = () => (
  <StatusButtonInner status={useConnectionStatus()} />
)
