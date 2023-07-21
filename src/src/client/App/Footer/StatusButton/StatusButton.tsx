import {
  ConnectionStatus,
  useConnectionStatus,
} from "@/client/services/connection"

import { Button, Root } from "../common-styles"
import { StatusCircle, StatusLabel } from "./styled"

export const StatusButtonInner = ({ status }: { status: ConnectionStatus }) => {
  const appStatus =
    status === ConnectionStatus.IDLE_DISCONNECTED ||
    status === ConnectionStatus.OFFLINE_DISCONNECTED
      ? ConnectionStatus.DISCONNECTED
      : status

  return (
    <Root>
      <Button disabled>
        <StatusCircle status={appStatus} />
        <StatusLabel>
          {appStatus[0].toUpperCase() + appStatus.slice(1).toLowerCase()}
        </StatusLabel>
      </Button>
    </Root>
  )
}

export const StatusButton = () => (
  <StatusButtonInner status={useConnectionStatus()} />
)
