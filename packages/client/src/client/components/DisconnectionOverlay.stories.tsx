import { Meta } from "@storybook/react"

import { ConnectionStatus } from "@/services/connection"

import { DisconnectionOverlayInner } from "./DisconnectionOverlay"

export default {
  title: "Components/DisconnectionOverlay",
  component: DisconnectionOverlayInner,
} as Meta<typeof DisconnectionOverlayInner>

export const Disconnected = {
  args: {
    connectionStatus: ConnectionStatus.DISCONNECTED,
  },
}

export const IdleDisconnected = {
  args: {
    connectionStatus: ConnectionStatus.IDLE_DISCONNECTED,
  },
}
