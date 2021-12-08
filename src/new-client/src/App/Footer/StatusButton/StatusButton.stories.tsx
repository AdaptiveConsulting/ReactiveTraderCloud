import { ConnectionStatus } from "@/services/connection"
import { ComponentMeta } from "@storybook/react"
import { StatusButtonInner } from "./StatusButton"

export default {
  title: "Footer/StatusButton",
  component: StatusButtonInner,
} as ComponentMeta<typeof StatusButtonInner>

export const Connecting = () => (
  <StatusButtonInner status={ConnectionStatus.CONNECTING} />
)

export const Connected = () => (
  <StatusButtonInner status={ConnectionStatus.CONNECTED} />
)

export const Disconnected = () => (
  <StatusButtonInner status={ConnectionStatus.DISCONNECTED} />
)

export const IdleDisconnected = () => (
  <StatusButtonInner status={ConnectionStatus.IDLE_DISCONNECTED} />
)
