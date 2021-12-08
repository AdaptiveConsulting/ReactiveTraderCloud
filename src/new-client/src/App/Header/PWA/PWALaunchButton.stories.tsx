import { ConnectionStatus } from "@/services/connection"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { LaunchButtonInner } from "./PWALaunchButton"

export default {
  title: "Header/PWALaunchButton",
  component: LaunchButtonInner,
} as ComponentMeta<typeof LaunchButtonInner>

const Template: ComponentStory<typeof LaunchButtonInner> = (args) => (
  <LaunchButtonInner {...args} />
)

export const HasPrompt = Template.bind({})
HasPrompt.args = {
  hasPrompt: true,
}

export const NoPrompt = Template.bind({})
NoPrompt.args = {
  hasPrompt: false,
}
