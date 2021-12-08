import { ComponentStory, ComponentMeta } from "@storybook/react"
import { AdaptiveLoader } from "./AdaptiveLoader"

export default {
  title: "Components/Loading/AdaptiveLoader",
  component: AdaptiveLoader,
  args: {
    size: 40,
  },
} as ComponentMeta<typeof AdaptiveLoader>

const Template: ComponentStory<typeof AdaptiveLoader> = (args) => (
  <AdaptiveLoader {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  type: "primary",
}

export const Secondary = Template.bind({})
Secondary.args = {
  type: "secondary",
}
