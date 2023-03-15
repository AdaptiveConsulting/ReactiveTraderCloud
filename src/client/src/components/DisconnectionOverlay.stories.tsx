import { ComponentMeta, ComponentStory } from "@storybook/react"

import { ConnectionStatus } from "@/services/connection"

import { DisconnectionOverlayInner } from "./DisconnectionOverlay"

export default {
  title: "Components/DisconnectionOverlay",
  component: DisconnectionOverlayInner,
} as ComponentMeta<typeof DisconnectionOverlayInner>

const Template: ComponentStory<typeof DisconnectionOverlayInner> = (args) => (
  <DisconnectionOverlayInner {...args} />
)

export const Disconnected = Template.bind({})
Disconnected.args = {
  connectionStatus: ConnectionStatus.DISCONNECTED,
}

export const IdleDisconnected = Template.bind({})
IdleDisconnected.args = {
  connectionStatus: ConnectionStatus.IDLE_DISCONNECTED,
}
