import { useConnectionStatus } from "@/services/connection"
import { StatusCircle, StatusLabel } from "./styled"
import { Root, Button } from "../common-styles"

export const StatusButton: React.FC = () => {
  const appStatus = useConnectionStatus()
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
