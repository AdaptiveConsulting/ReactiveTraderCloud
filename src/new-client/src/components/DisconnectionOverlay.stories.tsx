import { ConnectionStatus } from "@/services/connection"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { DisconnectionOverlayInner } from "./DisconnectionOverlay"

export default {
  title: "Components/DisconnectionOverlay",
  component: DisconnectionOverlayInner
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
