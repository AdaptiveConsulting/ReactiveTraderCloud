import { ConnectionStatus, useConnectionStatus } from "@/services/connection"
import { StatusCircle, StatusLabel } from "./styled"
import { Root, Button } from "../common-styles"

export const StatusButton: React.FC = () => {
  const appStatus = useConnectionStatus()
  const status =
    appStatus === ConnectionStatus.IDLE_DISCONNECTED
      ? ConnectionStatus.DISCONNECTED
      : appStatus
  return (
    <Root>
      <Button disabled>
        <StatusCircle status={status} />
        <StatusLabel>
          {status[0].toUpperCase() + status.slice(1).toLowerCase()}
        </StatusLabel>
      </Button>
    </Root>
  )
}
