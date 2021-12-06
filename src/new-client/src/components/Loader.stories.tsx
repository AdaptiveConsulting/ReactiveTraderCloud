import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Loader } from "./Loader"

export default {
  title: "Loader",
  component: Loader,
} as ComponentMeta<typeof Loader>

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />

export const Default = Template.bind({})
Default.args = {
  opacity: 0.8,
  size: 40,
}
