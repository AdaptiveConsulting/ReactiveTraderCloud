import { ConnectionStatus, connectionStatus$ } from "@/services/connection"
import { bind } from "@react-rxjs/core"
import { darken } from "polished"
import { map, scan } from "rxjs/operators"

import styled from "styled-components"

const ModalContainer = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  opacity: 0.75;

  background: ${({ theme }) => theme.overlay.backgroundColor};
`

const ModalPanel = styled.div`
  padding: 1rem 1.5rem;
  margin: 0 1rem;

  width: max-content;
  min-width: 16rem;
  max-width: 40rem;

  position: relative;
  z-index: 1;

  background: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    0 1rem 3rem -1rem ${(props) => darken(0.1, props.theme.overlay.backgroundColor)};
`

const Body = styled.div`
  margin: 1rem 0;
`

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

export const DisconnectionOverlay: React.FC = () => {
  return useHideOverlay() ? null : (
    <ModalContainer>
      <ModalOverlay />
      <ModalPanel>
        <Body>Trying to re-connect to the server...</Body>
      </ModalPanel>
    </ModalContainer>
  )
}
