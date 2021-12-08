import { ComponentStory, ComponentMeta } from "@storybook/react"
import Logo from "./Logo"

export default {
  title: "Components/Logo",
  component: Logo,
  args: {
    fill: "#000",
    size: 2,
    withText: true,
  },
  argTypes: {
    fill: {
      control: "color",
    },
  },
} as ComponentMeta<typeof Logo>

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />

export const WithText = Template.bind({})
WithText.args = {}

export const WithoutText = Template.bind({})
WithoutText.args = {
  withText: false,
}
