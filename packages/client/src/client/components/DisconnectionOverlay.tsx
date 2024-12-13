import { bind } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"
import styled from "styled-components"

import { Modal } from "@/client/components/Modal"
import {
  ConnectionStatus,
  connectionStatus$,
  initConnection,
  useConnectionStatus,
} from "@/services/connection"

import { Button } from "./Button"
import { FlexBox } from "./FlexBox"
import { Typography } from "./Typography"

type DisconnectedStatus =
  | ConnectionStatus.DISCONNECTED
  | ConnectionStatus.IDLE_DISCONNECTED
  | ConnectionStatus.OFFLINE_DISCONNECTED

const Wrapper = styled(FlexBox)`
  flex-direction: column;
  gap: ${({ theme }) => theme.newTheme.spacing.xl};
`

export const DisconnectionOverlayInner = ({
  connectionStatus,
  onReconnect,
}: {
  connectionStatus: DisconnectedStatus
  onReconnect: () => void
}) => (
  <Modal shouldShow>
    {connectionStatus === ConnectionStatus.IDLE_DISCONNECTED ? (
      <Wrapper>
        <Typography variant={"Text sm/Regular"}>
          You have been disconnected due to inactivity.
        </Typography>
        <Button variant="outline" size="lg" onClick={onReconnect}>
          Reconnect
        </Button>
      </Wrapper>
    ) : connectionStatus === ConnectionStatus.OFFLINE_DISCONNECTED ? (
      "This device has been detected to be offline.  Connection to the server will resume when a stable internet connection is established."
    ) : (
      "Trying to re-connect to the server..."
    )}
  </Modal>
)

const [useHideOverlay] = bind(
  connectionStatus$.pipe(
    map((connection) => connection === ConnectionStatus.CONNECTED),
    scan(
      (acc, connected) => {
        return {
          connected,
          hasBeenConnnected: acc.hasBeenConnnected || connected,
        }
      },
      { connected: true, hasBeenConnnected: false },
    ),
    map(({ hasBeenConnnected, connected }) => connected || !hasBeenConnnected),
  ),
  true,
)

export const DisconnectionOverlay = () => {
  const connectionStatus = useConnectionStatus()
  return useHideOverlay() ? null : (
    <DisconnectionOverlayInner
      connectionStatus={connectionStatus as DisconnectedStatus}
      onReconnect={initConnection}
    />
  )
}
