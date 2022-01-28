import { ComponentMeta, ComponentStory } from "@storybook/react"
import { PWAInstallModal } from "./PWAInstallModal"

export default {
  title: "Header/PWAInstallModal",
  component: PWAInstallModal,
} as ComponentMeta<typeof PWAInstallModal>

const Template: ComponentStory<typeof PWAInstallModal> = (args) => (
  <PWAInstallModal {...args} />
)

export const Default = Template.bind({})
Default.storyName = "PWAInstallModal"
