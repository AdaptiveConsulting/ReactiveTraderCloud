import { ConnectionStatus, useConnectionStatus } from "@/services/connection"
import { StatusCircle, StatusLabel } from "./styled"
import { Root, Button } from "../common-styles"

export const StatusButtonInner: React.FC<{ status: ConnectionStatus }> = ({
  status,
}) => {
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

export const StatusButton: React.FC = () => (
  <StatusButtonInner status={useConnectionStatus()} />
)
